var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var Shopping_bot_ch = {
  use: true
};

botlib.makeBot('Shopping_bot_ch', Shopping_bot_ch);

