var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var sdf = {
  use: true
};

botlib.makeBot('sdf', sdf);

