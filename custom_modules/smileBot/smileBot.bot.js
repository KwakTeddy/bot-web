var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var smileBot = {
  use: true
};

botlib.makeBot('smileBot', smileBot);

