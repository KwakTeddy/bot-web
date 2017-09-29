var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var botexp3 = {
  use: true
};

botlib.makeBot('botexp3', botexp3);

