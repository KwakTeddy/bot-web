var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var taobao = {
  use: true
};

botlib.makeBot('taobao', taobao);

