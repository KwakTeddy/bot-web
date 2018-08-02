var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var MokBot = {
  use: true
};

botlib.makeBot('MokBot', MokBot);

