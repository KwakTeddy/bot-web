var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var Asan = {
  use: true
};

botlib.makeBot('Asan', Asan);

