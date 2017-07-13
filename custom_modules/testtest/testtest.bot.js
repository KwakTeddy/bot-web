var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var testtest = {
  use: true
};

botlib.makeBot('testtest', testtest);

