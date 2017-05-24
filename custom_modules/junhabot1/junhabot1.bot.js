var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var junhabot1 = {
  use: true
};

botlib.makeBot('junhabot1', junhabot1);

