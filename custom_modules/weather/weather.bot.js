var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var weather = {
  use: true
};

botlib.makeBot('weather', weather);

