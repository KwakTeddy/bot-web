var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var junhatest_second = {
  use: true
};

botlib.makeBot('junhatest_second', junhatest_second);

