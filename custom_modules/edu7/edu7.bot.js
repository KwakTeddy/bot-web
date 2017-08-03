var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu7 = {
  use: true
};

botlib.makeBot('edu7', edu7);

