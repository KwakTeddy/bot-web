var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var bot_prac = {
  use: true
};

botlib.makeBot('bot_prac', bot_prac);

