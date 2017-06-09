var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var lgtogether = {
  use: true
};

botlib.makeBot('lgtogether', lgtogether);

