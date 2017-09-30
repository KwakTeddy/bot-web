var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var sdf = {
  use: true
};

botlib.makeBot('sdf', sdf);

