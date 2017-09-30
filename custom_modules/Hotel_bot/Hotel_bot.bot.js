var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var Hotel_bot = {
  use: true
};

botlib.makeBot('Hotel_bot', Hotel_bot);

