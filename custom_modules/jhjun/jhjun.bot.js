var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var jhjun = {
  use: true
};

botlib.makeBot('jhjun', jhjun);

