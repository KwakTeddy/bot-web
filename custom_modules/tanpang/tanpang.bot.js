var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tanpang = {
  use: true
};

botlib.makeBot('tanpang', tanpang);

