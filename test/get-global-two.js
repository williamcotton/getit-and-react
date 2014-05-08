var getIt = require("../index.js");

var getGlobalThree = require("./get-global-three");

var getGlobalTwo = function(echo, callback) {
  getGlobalThree(echo, function(err, res) {
    setTimeout(function() {
      callback(false, {
        echo: echo,
        globalThree: res
      }, true);
    }, 3);
  });
};

var mockTwo = {
  echo: "echo"
};

module.exports = getIt(getGlobalTwo, mockTwo);