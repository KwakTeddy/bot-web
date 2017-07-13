var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Hotel_bot_ch = {
  use: true
};

botlib.makeBot('Hotel_bot_ch', Hotel_bot_ch);

