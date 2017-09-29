var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var private_bot = {
  use: true
};

botlib.makeBot('private_bot', private_bot);

