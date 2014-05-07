var isArray = require("isarray");
var each = require("foreach");
var hasOwn = Object.prototype.hasOwnProperty;

var allTrue = function(array) {
  var all = true;
  each(array, function(value) {
    if (!value) {
      all = false;
    }
  });
  return all;
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

var mockFunction = function(retriever, mock) {
  
  var func = function() {
    if (typeof(func.MOCK) != "undefined" && !func.MOCK) {
      return retrieverFunction(retriever, mock).apply(func, arguments);
    }
    if (func.setMock) {
      mock = func.setMock;
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

var retrieverFunction = function(retriever, mock, updateWith, opts) {
  var triggerCallback;
  var lastAppliedArgs;
  var triggerCount = 0;
  var func = function() {
    var callbackCount = 0;
    if (func.MOCK) {
      var mockFunc = mockFunction(retriever, mock);
      mockFunc.setMock = func.setMock;
      return mockFunc.apply(func, arguments);
    }
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length-1];
    triggerCallback = function(triggerArgs) {
      ++triggerCount;
      callback.apply(callback, triggerArgs);
    };
    var start = +new Date();
    if (opts && opts.cacheStore && opts.cacheKey && opts.cacheStore.getItem && opts.cacheStore.getItem(opts.cacheKey)) {
      var previousResponse = opts.cacheStore.getItem(opts.cacheKey);
      var end = +new Date();
      var time = end - start;
      previousResponse.retrievalTime = time;
      callback.apply(callback, [true, previousResponse]);
      return;
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
      var previousResponse = lastAppliedArgs[1];
      if (opts && opts.cacheStore && opts.cacheKey) {
        opts.cacheStore.setItem(opts.cacheKey, previousResponse);
      }
      callback.apply(callback, _appliedArgs);
    };
    appliedArgs.push(newCallback);
    retriever.apply(retriever, appliedArgs);
  };
  updateWith.func = function(newResponse, opts) {
    if (lastAppliedArgs && lastAppliedArgs[1] && opts && opts.merge) {
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

var GLOBAL_MOCK;
var getIt = function(retriever, mock, opts) {
  var func;
  var updateWith = {};
  if ((typeof(MOCK) != 'undefined' && MOCK) || (typeof(GLOBAL_MOCK) != 'undefined' && GLOBAL_MOCK)) {
    func = mockFunction(retriever, mock);
  }
  else {
    func = retrieverFunction(retriever, mock, updateWith, opts);
  }
  func.updateWith = updateWith.func;
  func.checkIt = checkItFunction(retriever, mock);
  return func;
};

getIt.SET_GLOBAL_MOCK = function(global_mock) {
  GLOBAL_MOCK = global_mock;
};

module.exports = getIt;