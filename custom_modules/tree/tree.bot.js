var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tree = {
  use: true
};

botlib.makeBot('tree', tree);

