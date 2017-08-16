var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Asan = {
  use: true
};

botlib.makeBot('Asan', Asan);

