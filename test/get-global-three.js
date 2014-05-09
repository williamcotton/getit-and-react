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

module.getItFunction = getGlobalThree;
module.getItMock = mockThree;
module.getItOptions = {
  name: "getGlobalThree"
};

getIt.exportIt(module);