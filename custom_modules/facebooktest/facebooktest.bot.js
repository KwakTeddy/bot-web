var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var facebooktest = {
  use: true
};

botlib.makeBot('facebooktest', facebooktest);

