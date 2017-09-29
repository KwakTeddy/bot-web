var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var cafeTest = {
  use: true
};

botlib.makeBot('cafeTest', cafeTest);

