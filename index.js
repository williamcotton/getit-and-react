var isArray = require("isarray");
var each = require("foreach");
var hasOwn = Object.prototype.hasOwnProperty;

var GLOBAL_MOCK;
var GLOBAL_MOCK_STORE = {}
var GLOBAL_MOCK_DATA_STORE = {};

var allTrue = function(array) {
  var all = true;
  each(array, function(value) {
    if (!value) {
      all = false;
    }
  });
  return all;
};

var setMockData = function(retriever, setMock) {
  var key = retriever.toString();
  GLOBAL_MOCK_DATA_STORE[key] = setMock;
};

var getMockData = function(retriever) {
  var key = retriever.toString();
  return GLOBAL_MOCK_DATA_STORE[key];
};

var setMock = function(retriever, mock) {
  var key = retriever.toString();
  GLOBAL_MOCK_STORE[key] = mock;
};

var getMock = function(retriever) {
  var key = retriever.toString();
  return GLOBAL_MOCK_STORE[key];
};

var checkItFunction = function(retriever, mock) {
  
  var check = function(response, mock) {
    if (isArray(response) && !isArray(mock)) {
      return false;
    }
    if (typeof(response) && !typeof(mock)) {
      return false;
    }
    var allChecked = [];
    if (typeof(response) == "object") {
      each(mock, function(mockValue, mockKey) {
        var responseHasKey = typeof(response[mockKey]) != "undefined";
        allChecked.push(responseHasKey);
        if (!responseHasKey) {
          return false;
        }
        var responseValue = response[mockKey];
        var responseHasValue = typeof(responseValue) != "undefined";
        allChecked.push(responseHasValue);
        check(responseValue, mockValue);
      });
      if (!allTrue(allChecked)) {
        return false;
      }
    }
    return true;
  };
  
  var func = function() {
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length-1];
    var appliedArgs = args.slice(0, args.length-1);
    var newCallback = function(err, response) {
      callback(true, {
        checked: check(response, mock)
      });
    };
    appliedArgs.push(newCallback);
    retriever.apply(retriever, appliedArgs);    
    

  };
  return func;
};

var mockFunction = function(retriever, mock, objState) {
  
  var func = function() {

    if (getMockData(retriever)) {
      mock = getMockData(retriever);
    }
    var callback = arguments[arguments.length-1];
    var mockArgs;
    if (isArray(mock)) {
      for (var i = 0; i < mock.length; i++) {
        mock[i].retrievalTime = 0;
      }
      mockArgs = [false].concat(mock);
    }
    else {
      mock.retrievalTime = 0;
      mockArgs = [false, mock];
    }
    callback.apply(callback, mockArgs);
  };
  
  return func;
};

var retrieverFunction = function(retriever, mock, objState) {
  var triggerCallback;
  var lastAppliedArgs;
  var triggerCount = 0;
  var previousResponse;
  var func = function() {
    var callbackCount = 0;
    if (getMock(retriever)) {
      var mockFunc = mockFunction(retriever, mock, objState);
      return mockFunc.apply(func, arguments);
    }
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length-1];
    triggerCallback = function(triggerArgs) {
      ++triggerCount;
      callback.apply(callback, triggerArgs);
    };
    var start = +new Date();
    if (objState && objState.cacheStore && objState.cacheKey && objState.cacheStore.getItem(objState.cacheKey)) {
      var cachedResponse = objState.cacheStore.getItem(objState.cacheKey);
      var end = +new Date();
      var time = end - start;
      cachedResponse.retrievalTime = time;
      callback.apply(callback, [true, cachedResponse]);
    }
    var appliedArgs = args.slice(0, args.length-1);
    var newCallback = function() {
      ++callbackCount;
      var end = +new Date();
      var time = end - start;
      var _args = Array.prototype.slice.call(arguments);
      var results = _args.slice(1, _args.length);
      for (var i = 0; i < results.length; i++) {
        results[i].retrievalTime = time;
      }
      var _appliedArgs = [_args[0]].concat(results);
      lastAppliedArgs = _appliedArgs;
      previousResponse = lastAppliedArgs[1];
      if (objState && objState.cacheStore && objState.cacheKey) {
        objState.cacheStore.setItem(objState.cacheKey, previousResponse);
      }
      callback.apply(callback, _appliedArgs);
    };
    appliedArgs.push(newCallback);
    retriever.apply(retriever, appliedArgs);
  };
  objState.updateWith = function(newResponse, objState) {
    if (lastAppliedArgs && lastAppliedArgs[1] && objState && objState.merge) {
      var previousResponse = lastAppliedArgs[1];
      each(newResponse, function(value, key) {
        previousResponse[key] = value;
      });
      triggerCallback([lastAppliedArgs[0]].concat(previousResponse));
    }
    else {
      triggerCallback([true].concat(newResponse));
    }
  };
  objState.getPreviousResponse = function() {
    return previousResponse;
  };
  return func;
};

var cacheFunction = function(previousResponse) {
  var func = function() {
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length-1];
    callback(true, previousResponse);
  };
  return func;
};

var getIt = function(retriever, mock, objState) {
  objState = objState || {};
  objState.mock = GLOBAL_MOCK;
  var func = retrieverFunction(retriever, mock, objState);
  func.updateWith = objState.updateWith;
  func.getPreviousResponse = objState.getPreviousResponse;
  func.checkIt = checkItFunction(retriever, mock);
  func.mock = function(val){
    setMock(retriever, val);
  };
  func.setMock = function(val){
    setMockData(retriever, val);
  };
  return func;
};

getIt.SET_GLOBAL_MOCK = function(global_mock) {
  GLOBAL_MOCK = global_mock;
};

getIt.GET_GLOBAL_MOCK = function() {
  return GLOBAL_MOCK;
};

module.exports = getIt;