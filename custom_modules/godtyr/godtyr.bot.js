var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var godtyr = {
  use: true
};

botlib.makeBot('godtyr', godtyr);

