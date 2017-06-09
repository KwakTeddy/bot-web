var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var qww = {
  use: true
};

botlib.makeBot('qww', qww);

