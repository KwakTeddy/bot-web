var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var chatbot_menu = {
  use: true
};

botlib.makeBot('chatbot_menu', chatbot_menu);

