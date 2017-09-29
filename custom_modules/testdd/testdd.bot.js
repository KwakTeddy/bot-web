var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var testdd = {
  use: true
};

botlib.makeBot('testdd', testdd);

