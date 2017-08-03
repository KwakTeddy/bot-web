var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu1 = {
  use: true
};

botlib.makeBot('edu1', edu1);

