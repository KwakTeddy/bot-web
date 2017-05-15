var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sampletree = {
  use: true
};

botlib.makeBot('sampletree', sampletree);

