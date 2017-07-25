var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu6 = {
  use: true
};

botlib.makeBot('edu6', edu6);

