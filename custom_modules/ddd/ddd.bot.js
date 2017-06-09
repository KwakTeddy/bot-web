var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var ddd = {
  use: true
};

botlib.makeBot('ddd', ddd);

