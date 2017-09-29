var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var orderbot = {
  use: true
};

botlib.makeBot('orderbot', orderbot);

