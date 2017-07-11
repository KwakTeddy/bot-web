var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test5 = {
  use: true
};

botlib.makeBot('test5', test5);

