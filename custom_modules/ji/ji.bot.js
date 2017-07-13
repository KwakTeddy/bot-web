var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var ji = {
  use: true
};

botlib.makeBot('ji', ji);

