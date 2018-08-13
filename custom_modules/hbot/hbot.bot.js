var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var hbot = {
  use: true
};

botlib.makeBot('hbot', hbot);

