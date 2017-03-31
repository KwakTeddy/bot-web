var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var vens = {
  use: true,
  useQuibble: true
};

botlib.makeBot('vens', vens);

