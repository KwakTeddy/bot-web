var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var yayayam = {
  use: true
};

botlib.makeBot('yayayam', yayayam);

