var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var bot_prac = {
  use: true
};

botlib.makeBot('bot_prac', bot_prac);

