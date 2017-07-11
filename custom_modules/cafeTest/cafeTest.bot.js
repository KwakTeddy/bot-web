var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var cafeTest = {
  use: true
};

botlib.makeBot('cafeTest', cafeTest);

