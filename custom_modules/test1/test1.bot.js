var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test1 = {
  use: true
};

botlib.makeBot('test1', test1);

