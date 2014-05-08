var getIt = require("../index");
getIt.SET_GLOBAL_MOCK(true);

var getGlobalOne = require("./get-global-one");
var getGlobalTwo = require("./get-global-two");
var getGlobalThree = require("./get-global-two");

describe("mocks", function() {
  
  it("should call getGlobalOne's retriever", function(done) {
    var input = 23;
    getGlobalOne.mock(false);
    getGlobalOne(input, function(err, res) {
      expect(res.input).toBe(input);
      done();
    });
  });
  
  it("should call getGlobalOne's retriever with getGlobalTwo's retriever", function(done) {
    var input = 23;
    getGlobalOne.mock(false);
    getGlobalTwo.mock(false);
    getGlobalOne(input, function(err, res) {
      expect(res.input).toBe(input);
      expect(res.globalTwo.echo).toBe(input);
      done();
    });
  });
  
  it("should call getGlobalOne's retriever with getGlobalTwo's mock", function(done) {
    var input = 23;
    getGlobalOne.mock(false);
    getGlobalTwo.mock(true);
    getGlobalOne(input, function(err, res) {
      expect(res.input).toBe(input);
      expect(res.globalTwo.echo).toBe("echo");
      done();
    });
  });
  
  it("should call getGlobalOne's retriever with getGlobalTwo's retriever and getGlobalThree's retriever", function(done) {
    var input = 23;
    getGlobalOne.mock(false);
    getGlobalTwo.mock(false);
    getGlobalThree.mock(false);
    getGlobalOne(input, function(err, res) {
      expect(res.input).toBe(input);
      expect(res.globalTwo.globalThree.ping).toBe(input);
      done();
    });
  });
  
  it("should call getGlobalOne's mock", function(done) {
    var input = 23;
    getGlobalOne.mock(true);
    getGlobalOne(input, function(err, res) {
      expect(res.input).toBe(43);
      done();
    });
  });
  
});