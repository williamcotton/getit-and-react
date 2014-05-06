var updateItFunction = function(retriever, mock) {
  var func = function() {
    var newResponse;
    if (arguments.length == 1) {
      newResponse = arguments[0];
    }
    else {
      newResponse = arguments;
    }
    // and trigger the callback on the retriever with the newResponse
    // by doing some magic with .apply()
  };
  return func;
}

var checkItFunction = function(retriever, mock) {
  var func = function() {
    
  };
  return func;
}

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
    if (typeof(mock) == "object" && mock.length) {
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

var retrieverFunction = function(retriever, mock) {
  var func = function() {
    if (func.MOCK) {
      return mockFunction(retriever, mock).apply(func, arguments);
    }
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length-1];
    var appliedArgs = args.slice(0, args.length-1);
    var start = +new Date;
    var newCallback = function() {
      var end = +new Date;
      var time = end - start;
      var _args = Array.prototype.slice.call(arguments);
      var results = _args.slice(1, _args.length);
      for (var i = 0; i < results.length; i++) {
        results[i].retrievalTime = time;
      }
      var _appliedArgs = [_args[0]].concat(results);
      callback.apply(callback, _appliedArgs);
    }
    appliedArgs.push(newCallback);
    retriever.apply(retriever, appliedArgs);
  };
  return func;
};

var getIt = function(retriever, mock) {
  var func;
  if (typeof(MOCK) != 'undefined' && MOCK) {
    func = mockFunction(retriever, mock);
  }
  else {
    func = retrieverFunction(retriever, mock);
  }
  func.updateIt = updateItFunction(retriever, mock);
  func.checkIt = checkItFunction(retriever, mock);
  return func;
};

module.exports = getIt;