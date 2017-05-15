var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sampletree2 = {
  use: true
};

botlib.makeBot('sampletree2', sampletree2);

