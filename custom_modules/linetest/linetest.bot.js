var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var linetest = {
  use: true
};

botlib.makeBot('linetest', linetest);

