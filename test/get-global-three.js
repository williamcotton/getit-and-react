var getIt = require("../index.js");

var getGlobalThree = function(ping, callback) {
  setTimeout(function() {
    callback(false, {
      ping: ping
    });
  }, 2);
};

var mockThree = {
  ping: "pong"
};

module.exports = getIt(getGlobalThree, mockThree, {name: "getGlobalThree"});