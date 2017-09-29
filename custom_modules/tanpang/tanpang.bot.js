var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var tanpang = {
  use: true
};

botlib.makeBot('tanpang', tanpang);

