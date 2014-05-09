var getIt = require("../index.js");

var getGlobalThree = require("./get-global-three");

var getGlobalTwo = function(echo, callback) {
  getGlobalThree(echo, function(err, res) {
    setTimeout(function() {
      callback(false, {
        echo: echo,
        globalThree: res
      });
    }, 3);
  });
};

var mockTwo = {
  echo: "echo"
};

module.getItFunction = getGlobalTwo;
module.getItMock = mockTwo;
module.getItOptions = {};

getIt.exportIt(module);