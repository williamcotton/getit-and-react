getIt and React
===============

[![TravisCI Build Status](https://travis-ci.org/williamcotton/getit-and-react.svg)](https://travis-ci.org/williamcotton/getit-and-react)

getIt wraps your remote API calls providing inline mocks, timing functions, and more.
  
The perfect companion for React. getIt and React. getIt?
  
getIt modules callback many times in their lifetime and are designed to keep the caller up to date.

```npm install getit-and-react```

### Basic Usage

Declare a function that callbacks with response object and a mock of that response object.

```javascript

var waitForItFunction = function(secondsToWait, callback) {
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
};

var waitForItMock = {
  waitedFor: 0
};

var waitForIt = getIt(waitForItFunction, waitForItMock);
```

Then use it like normal.

```javascript
waitForIt(function(error, response) {
  console.log("I got a response at: ", response.currentTime);
  if (response.waitedFor) {
    console.log("I waited for: " response.waitedFor);
    console.log("but also I keep track of my own time: " + res.retrievalTime);
  }
});
```

It has some tricks up its sleeves...

### Mocks

Have fine-grained control over how your functions and modules are mocked.

```javascript

MOCK = true; // global
waitForIt.MOCK = true; // or per module
waitForIt.MOCK = false; // or disable some mocks when the rest are global

waitForIt.setMock = { // update the mock for custom testing
  waitedFor: 50000
};

```

### checkIt

Compares the results from the retriever with the mock and lets you know if the interface has changed.

This is useful when using remote APIs. The remote function call can be compared to the mock to make sure that the response object is what is expected.

```javascript
waitForIt.checkIt(function(error, response) {
  var checked = response.checked;
  if (checked) {
    console.log("It all checks out");
  }
});
```

### updateWith

Calls all of the retriever function callbacks with a new object.

This is useful for when you need to trigger updates to the object from another source but callback all existing listening functions.

```javacript
waitForIt.updateWith({
  currentTime: +new Date
});
```

### cacheStore

Pass in a cacheStore that supports ```getItem(key)```, ```setItem(key, value)```, and ```removeItem(key)```.

Whenever the function is called it will return the last cached value.

Coming soon: time-based cache expiry, return-cache-and-continue-to-fetch.

```javacript

waitForIt = getIt(waitForItFunction, waitForItMock, { cacheKey: "waitForIt", cacheStore: sessionStorage });

```