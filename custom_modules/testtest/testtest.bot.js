var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var testtest = {
  use: true
};

botlib.makeBot('testtest', testtest);

