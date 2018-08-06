var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var chat = {
  use: true
};

botlib.makeBot('chat', chat);

