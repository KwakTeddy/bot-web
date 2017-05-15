var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var lgdemobot = {
  use: true
};

botlib.makeBot('lgdemobot', lgdemobot);

