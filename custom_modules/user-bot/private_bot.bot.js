var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var private_bot = {
  use: true
};

botlib.makeBot('private_bot', private_bot);

