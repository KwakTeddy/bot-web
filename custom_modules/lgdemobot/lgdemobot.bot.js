var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var lgdemobot = {
  use: true
};

botlib.makeBot('lgdemobot', lgdemobot);

