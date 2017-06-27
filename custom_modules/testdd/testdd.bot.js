var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var testdd = {
  use: true
};

botlib.makeBot('testdd', testdd);

