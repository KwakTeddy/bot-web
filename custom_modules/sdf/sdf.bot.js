var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sdf = {
  use: true
};

botlib.makeBot('sdf', sdf);

