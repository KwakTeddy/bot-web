var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var coupang2 = {
  use: true
};

botlib.makeBot('coupang2', coupang2);

