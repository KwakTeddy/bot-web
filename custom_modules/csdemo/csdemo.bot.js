var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var csdemo = {
  use: true,
  useQuibble: false
};

botlib.makeBot('csdemo', csdemo);

