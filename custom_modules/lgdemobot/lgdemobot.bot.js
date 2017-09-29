var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var lgdemobot = {
  use: true
};

botlib.makeBot('lgdemobot', lgdemobot);

