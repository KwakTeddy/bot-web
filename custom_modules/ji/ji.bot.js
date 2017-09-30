var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var ji = {
  use: true
};

botlib.makeBot('ji', ji);

