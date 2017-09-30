var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var cafeTest = {
  use: true
};

botlib.makeBot('cafeTest', cafeTest);

