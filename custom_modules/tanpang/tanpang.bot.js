var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var tanpang = {
  use: true
};

botlib.makeBot('tanpang', tanpang);

