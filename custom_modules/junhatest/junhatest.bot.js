var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var junhatest = {
  use: true
};

botlib.makeBot('junhatest', junhatest);

