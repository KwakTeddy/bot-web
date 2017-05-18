var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var werwer = {
  use: true
};

botlib.makeBot('werwer', werwer);

