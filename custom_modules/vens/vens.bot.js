var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var vens = {
  use: true,
  useQuibble: true
};

botlib.makeBot('vens', vens);

