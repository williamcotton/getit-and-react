getIt and React
===============

getIt wraps your remote API calls providing inline mocks, timing functions, and more.
  
The perfect companion for React. getIt and React. getIt?
  
getIt modules callback many times in their lifetime and are designed to keep the caller up to date.

```javascript

getIt(retrievalFunction, mockResponse);

var waitForIt = getIt(function(secondsToWait, callback) {
  var error = false;
  var response = {
    currentTime: +new Date
  }
  callback(error, response); // we callback immediately
  setTimeout(function() {
    response.waitedFor = secondsToWait;
    response.currentTime = +new Date;
    callback(error, response); // and again after an update
  }, secondsToWait*1000);
}, {
  waitedFor: 0
});

waitForIt(function(error, response) {
  console.log("I got a response at: ", response.currentTime);
  if (response.waitedFor) {
    console.log("I waited for: " response.waitedFor);
    console.log("but also I keep track of my own time: " + res.retrievalTime);
  }
});

MOCK = true; // global
waitForIt.MOCK = true; // or per module
waitForIt.MOCK = false; // or disable some mocks when the rest are global

waitForIt.setMock = { // update the mock for custom testing
  waitedFor: 50000
},

// compares the results from the retrievalFunction with the mockResponse and lets you know if the API has changed
waitForIt.checkIt(function(error, response) {
  var checked = response.checked;
  if (checked) {
    console.log("It all checks out");
  }
});

waitForIt.updateIt({
  currentTime: +new Date
});

```