var getIt = require("../index.js");

var getGlobalTwo = require("./get-global-two");

var getGlobalOne = function(input, callback) {
  getGlobalTwo(input, function(err, res) {
    setTimeout(function() {
      callback(false, {
        input: input,
        globalTwo: res
      }, true);
    }, 5);
  });
};

var mockOne = {
  input: 43
};

module.exports = getIt(getGlobalOne, mockOne);