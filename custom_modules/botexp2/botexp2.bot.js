var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var botexp2 = {
  use: true
};

botlib.makeBot('botexp2', botexp2);

