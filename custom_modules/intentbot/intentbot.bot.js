var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var intentbot = {
  use: true
};

botlib.makeBot('intentbot', intentbot);

