var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var csdemo = {
  use: true
};

botlib.makeBot('csdemo', csdemo);

