var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var taobao2 = {
  use: true
};

botlib.makeBot('taobao2', taobao2);

