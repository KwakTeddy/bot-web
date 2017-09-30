var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var orderbot = {
  use: true
};

botlib.makeBot('orderbot', orderbot);

