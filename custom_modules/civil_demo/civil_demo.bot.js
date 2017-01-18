var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var civil_demo = {
  use: true
};

botlib.makeBot('civil_demo', civil_demo);

