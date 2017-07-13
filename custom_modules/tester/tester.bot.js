var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tester = {
  use: true
};

botlib.makeBot('tester', tester);

