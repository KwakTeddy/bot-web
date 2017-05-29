var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var dev2bot = {
  use: true
};

botlib.makeBot('dev2bot', dev2bot);

