var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var pracprac = {
  use: true
};

botlib.makeBot('pracprac', pracprac);

