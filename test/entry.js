var getGlobalOne = require("./get-global-one");
var getGlobalTwo = require("./get-global-two");

expect(module.children.length).toBe(2);
expect(module.children[0].id).toBe("./get-global-one");
expect(module.children[1].id).toBe("./get-global-two");

var firstChild = module.children[0].exports;

var input = 23;
getGlobalOne(input, function(err, res) {
  expect(res.input).toBe(input);
  firstChild(input, function(err, res) {
    expect(res.input).toBe(input);
    done();
  });
});

module.exports = {
  a: 123
};