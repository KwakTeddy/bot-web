var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tklee = {
  use: true
};

botlib.makeBot('tklee', tklee);

