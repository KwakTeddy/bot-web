var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu3 = {
  use: true
};

botlib.makeBot('edu3', edu3);

