var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var vens = {
  use: true,
  useQuibble: true
};

botlib.makeBot('vens', vens);

