var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var taobao = {
  use: true
};

botlib.makeBot('taobao', taobao);

