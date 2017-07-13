var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var orderbot = {
  use: true
};

botlib.makeBot('orderbot', orderbot);

