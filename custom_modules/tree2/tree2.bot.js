var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tree2 = {
  use: true
};

botlib.makeBot('tree2', tree2);

