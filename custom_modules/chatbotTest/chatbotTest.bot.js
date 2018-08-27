var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var chatbotTest = {
  use: true
};

botlib.makeBot('chatbotTest', chatbotTest);

