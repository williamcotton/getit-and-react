var browserify = require('browserify');
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var prelude = fs.readFileSync(path.join(__dirname, 'prelude.js'), 'utf8');

describe("browserify", function() {
  
  it("should run", function(done) {
    
    var b = browserify(__dirname + '/entry.js');
    b.bundle({prelude: prelude}, function (err, src) {

        vm.runInNewContext(src, {
          expect: expect,
          done: done,
          setTimeout : setTimeout,
          console: {
            log: function() {
              console.log.apply(console, arguments);
            }
          }
        });
    });

  });
  
});