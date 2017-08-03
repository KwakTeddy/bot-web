var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sangwoobot2 = {
  use: true
};

botlib.makeBot('sangwoobot2', sangwoobot2);

