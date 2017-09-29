var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var coupang = {
  use: true
};

botlib.makeBot('coupang', coupang);

