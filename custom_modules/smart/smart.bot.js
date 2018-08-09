var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var smart = {
  use: true
};

botlib.makeBot('smart', smart);

