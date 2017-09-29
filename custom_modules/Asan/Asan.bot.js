var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var Asan = {
  use: true
};

botlib.makeBot('Asan', Asan);

