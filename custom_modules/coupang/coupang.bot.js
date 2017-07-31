var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var coupang = {
  use: true
};

botlib.makeBot('coupang', coupang);

