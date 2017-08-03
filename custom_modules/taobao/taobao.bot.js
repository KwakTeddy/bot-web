var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var taobao = {
  use: true
};

botlib.makeBot('taobao', taobao);

