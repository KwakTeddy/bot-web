var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var botexp11 = {
  use: true
};

botlib.makeBot('botexp11', botexp11);

