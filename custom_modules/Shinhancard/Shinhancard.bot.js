var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true
};

botlib.makeBot('Shinhancard', Shinhancard);
