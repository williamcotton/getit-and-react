var getIt = require("../index.js");

var _closureStore = {};
var closureStorage = {
  getItem: function(key) {
    return _closureStore[key];
  },
  setItem: function(key, value) {
    _closureStore[key] = value;
  },
  removeItem: function(key) {
    delete(_closureStore[key]);
  }
};

describe("getIt", function() {
  
  var testRetriever, testMock, getTest;
  beforeEach(function() {
    testRetriever = function(sleepTime, callback) {
      if (sleepTime) {
        setTimeout(function() {
          callback(true, {
            sleepTime: sleepTime,
            sheep: [
              { color: "black" }
            ],
            yawns: 17
          });
        }, sleepTime);
      }
      else {
        callback(false, {});
      }
    };
    testMock = {
      sleepTime: 5,
      sheep: [
        { color: "white" }
      ],
      yawns: 3
    };
    getTest = getIt(testRetriever, testMock);
  });
  
  it("should call the retriever", function(done) {
    var time = 3;
    getTest(time, function(error, res) {
      expect(res.sleepTime).toBe(time);
      done();
    });
  });
  
  it("should call the mock", function(done) {
    getTest.MOCK = true;
    var time = 3;
    getTest(time, function(error, res) {
      expect(res.sleepTime).not.toBe(time);
      done();
    });
  });
  
  it("should call the mock with SET_GLOBAL_MOCK", function(done) {
    getIt.SET_GLOBAL_MOCK(true);
    getTest = getIt(testRetriever, testMock);
    var time = 3;
    getTest(time, function(error, res) {
      expect(res.sleepTime).not.toBe(time);
      getIt.SET_GLOBAL_MOCK(false);
      done();
    });
  });
  
  it("should be able to set a mock", function(done) {
    getTest.MOCK = true;
    var mockTime = 11;
    getTest.setMock = {sleepTime: mockTime};
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(mockTime);
      done();
    });
  });
  
  it("should have a response and a mock that check out fine with a valid mock", function(done) {
    getTest.checkIt(7, function(error, res) {
      expect(res.checked).toBe(true);
      done();
    });
  });
  
  it("should have a response and a mock that don't check out with an invalid mock", function(done) {
    var failMock = {
      yopTime: 5,
      yappers: [
        { color: "yellow" }
      ],
      yips: 3
    };
    getTest = getIt(testRetriever, failMock);
    getTest.checkIt(2, function(error, res) {
      expect(res.checked).toBe(false);
      done();
    });
  });
  
  it("should have a response and a mock that check out fine when the response has more data than the mock", function(done) {
    var slimMock = {
      sleepTime: 19
    };
    getTest = getIt(testRetriever, slimMock);
    getTest.checkIt(3, function(error, res) {
      expect(res.checked).toBe(true);
      done();
    });
  });
  
  it("should update the response", function(done) {
    var responses = [];
    getTest(7, function(error, res) {
      responses.push(res);
      if (responses.length == 2) {
        expect(responses[0].sleepTime).toBe(39);
        expect(responses[1].sleepTime).toBe(7);
        done();
      }
    });
    getTest.updateWith({sleepTime: 39});
  });
  
  it("should update and merge with the previous response", function(done) {
    var responses = [];
    getTest(2, function(error, res) {
      responses.push(res);
      if (responses.length == 1) {
        expect(responses[0].yawns).toBe(17);
        expect(responses[0].sleepTime).toBe(2);
      }
      if (responses.length == 2) {
        expect(responses[1].yawns).toBe(17);
        expect(responses[1].sleepTime).toBe(41);
        done();
      }
    });
    setTimeout(function() {
      getTest.updateWith({sleepTime: 41}, {merge: true});
    }, 7);
  });
  
  it("should call the retriever and get a retrieval time", function(done) {
    var time = 3;
    getTest(time, function(error, res) {
      expect(res.retrievalTime).toBeGreaterThan(time-1);
      expect(res.sleepTime).toBe(time);
      done();
    });
  });
  
  it("should call the retriever and get a cached response", function(done) {
    getTest = getIt(testRetriever, testMock, { cacheKey: "getTest", cacheStore: closureStorage });
    var time = 30;
    getTest(time, function(error, res) {
      expect(res.sleepTime).toBe(time);
      getTest(time, function(error, res) {
        expect(res.retrievalTime).toBe(0);
        done();
      });
    });
  });
  
});