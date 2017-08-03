var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu12 = {
  use: true
};

botlib.makeBot('edu12', edu12);

