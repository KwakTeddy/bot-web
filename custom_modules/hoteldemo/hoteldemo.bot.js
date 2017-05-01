var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var hoteldemo = {
  use: true
};

botlib.makeBot('hoteldemo', hoteldemo);

