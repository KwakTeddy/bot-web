var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sangwoobot1 = {
  use: true
};

botlib.makeBot('sangwoobot1', sangwoobot1);

