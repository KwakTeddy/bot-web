var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var junhabot = {
  use: true
};

botlib.makeBot('junhabot', junhabot);

