var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var cafe_test = {
  use: true
};

botlib.makeBot('cafe_test', cafe_test);

