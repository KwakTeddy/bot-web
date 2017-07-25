var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var templateTest = {
  use: true
};

botlib.makeBot('templateTest', templateTest);

