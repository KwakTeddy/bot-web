var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var facebooktest = {
  use: true
};

botlib.makeBot('facebooktest', facebooktest);

