var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var facebooktest = {
  use: true
};

botlib.makeBot('facebooktest', facebooktest);

