var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var Shopping_bot = {
  use: true
};

botlib.makeBot('Shopping_bot', Shopping_bot);

