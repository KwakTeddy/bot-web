var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test_2 = {
  use: true
};

botlib.makeBot('test_2', test_2);

