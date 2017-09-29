var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var cafe_test = {
  use: true
};

botlib.makeBot('cafe_test', cafe_test);

