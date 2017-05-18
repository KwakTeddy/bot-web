var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var lgdemosimple = {
  use: true
};

botlib.makeBot('lgdemosimple', lgdemosimple);

