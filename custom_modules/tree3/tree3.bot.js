var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tree3 = {
  use: true
};

botlib.makeBot('tree3', tree3);

