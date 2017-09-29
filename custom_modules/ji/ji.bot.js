var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var ji = {
  use: true
};

botlib.makeBot('ji', ji);

