var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu15 = {
  use: true
};

botlib.makeBot('edu15', edu15);

