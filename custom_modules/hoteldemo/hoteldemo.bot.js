var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var hoteldemo = {
  use: true
};

botlib.makeBot('hoteldemo', hoteldemo);

