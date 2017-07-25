var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var edu14 = {
  use: true
};

botlib.makeBot('edu14', edu14);

