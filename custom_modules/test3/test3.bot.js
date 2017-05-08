var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test3 = {
  use: true
};

botlib.makeBot('test3', test3);

