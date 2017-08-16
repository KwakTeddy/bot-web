var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var md_chicken = {
  use: true
};

botlib.makeBot('md_chicken', md_chicken);

