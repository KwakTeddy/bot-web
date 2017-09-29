var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var TEST = {
  use: true
};

botlib.makeBot('TEST', TEST);

