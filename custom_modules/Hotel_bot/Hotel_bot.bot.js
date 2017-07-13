var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Hotel_bot = {
  use: true
};

botlib.makeBot('Hotel_bot', Hotel_bot);

