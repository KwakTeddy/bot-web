var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var coupang = {
  use: true
};

botlib.makeBot('coupang', coupang);

