var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var hi = {
  use: true
};

botlib.makeBot('hi', hi);

