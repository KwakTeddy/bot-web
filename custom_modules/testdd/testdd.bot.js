var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var testdd = {
  use: true
};

botlib.makeBot('testdd', testdd);

