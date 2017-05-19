var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Test = {
  use: true
};

botlib.makeBot('Test', Test);

