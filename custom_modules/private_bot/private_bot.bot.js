var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var private_bot = {
  use: true
};

botlib.makeBot('private_bot', private_bot);

