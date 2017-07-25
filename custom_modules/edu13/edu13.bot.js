var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu13 = {
  use: true
};

botlib.makeBot('edu13', edu13);

