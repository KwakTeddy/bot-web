var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var TEST = {
  use: true
};

botlib.makeBot('TEST', TEST);

