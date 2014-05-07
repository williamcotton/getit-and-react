var getIt = require("../index.js");

describe("getIt", function() {
  
  var testRetriever, testMock, getTest;
  beforeEach(function() {
    testRetriever = function(sleepTime, callback) {
      if (sleepTime) {
        setTimeout(function() {
          callback(true, {sleepTime: sleepTime});
        }, sleepTime);
      }
      else {
        callback(false, {});
      }
    };
    testMock = {
      sleepTime: 5
    };
    getTest = getIt(testRetriever, testMock);
  });
  
  it("should call the retriever", function(done) {
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(3);
      done();
    });
  });
  
  it("should call the mock", function(done) {
    getTest.MOCK = true;
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(5);
      done();
    });
  });
  
  it("should call the mock with SET_GLOBAL_MOCK", function(done) {
    getIt.SET_GLOBAL_MOCK(true);
    getTest = getIt(testRetriever, testMock);
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(5);
      done();
    });
  });
  
  it("should call the mock with a global MOCK flag", function(done) {
    MOCK = true;
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(5);
      done();
    });
  });
  
  it("should be able to set a mock", function(done) {
    getTest.setMock = {sleepTime: 12};
    getTest.MOCK = true;
    getTest(3, function(error, res) {
      expect(res.sleepTime).toBe(12);
      done();
    });
  });
  
});