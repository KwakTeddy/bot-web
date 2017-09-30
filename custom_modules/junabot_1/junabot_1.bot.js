var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var junabot_1 = {
  use: true
};

botlib.makeBot('junabot_1', junabot_1);

