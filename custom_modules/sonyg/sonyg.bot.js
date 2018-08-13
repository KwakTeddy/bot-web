var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sonyg = {
  use: true
};

botlib.makeBot('sonyg', sonyg);

