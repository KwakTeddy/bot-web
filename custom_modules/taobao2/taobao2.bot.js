var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var taobao2 = {
  use: true
};

botlib.makeBot('taobao2', taobao2);

