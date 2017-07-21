var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var samplegraph = {
  use: true
};

botlib.makeBot('samplegraph', samplegraph);

