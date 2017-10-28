var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var delivery2 = {
  use: true
};

botlib.makeBot('delivery2', delivery2);

