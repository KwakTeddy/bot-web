var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var naranara = {
  use: true
};

botlib.makeBot('naranara', naranara);

