var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var bot_exp5 = {
  use: true
};

botlib.makeBot('bot_exp5', bot_exp5);

