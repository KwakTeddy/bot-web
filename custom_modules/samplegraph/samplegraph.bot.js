var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var samplegraph = {
  use: true
};

botlib.makeBot('samplegraph', samplegraph);

