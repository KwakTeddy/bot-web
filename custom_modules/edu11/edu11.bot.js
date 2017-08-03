var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu11 = {
  use: true
};

botlib.makeBot('edu11', edu11);

