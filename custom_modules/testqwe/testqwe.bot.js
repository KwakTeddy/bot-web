var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var testqwe = {
  use: true
};

botlib.makeBot('testqwe', testqwe);

