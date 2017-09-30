var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var Shopping_bot_upgr = {
  use: true
};

botlib.makeBot('Shopping_bot_upgr', Shopping_bot_upgr);

