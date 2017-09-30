var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var TEST = {
  use: true
};

botlib.makeBot('TEST', TEST);

