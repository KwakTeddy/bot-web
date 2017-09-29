var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var samplegraph = {
  use: true
};

botlib.makeBot('samplegraph', samplegraph);

