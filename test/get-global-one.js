// console.log("check", 1);
// console.log("require", require);
// console.log("module", module);
// console.log("exports", exports);

var getIt = require("../index.js");

// console.log("check", 2);

var getGlobalTwo = require("./get-global-two");

var getGlobalOne = function(input, callback) {
  getGlobalTwo(input, function(err, res) {
    setTimeout(function() {
      callback(false, {
        input: input,
        globalTwo: res
      });
    }, 5);
  });
};

var mockOne = {
  input: 43
};

module.getItFunction = getGlobalOne;
module.getItMock = mockOne;
module.getItOptions = {};

getIt.exportIt(module);