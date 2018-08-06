var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var junhaTest = {
  use: true
};

botlib.makeBot('junhaTest', junhaTest);

