var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var testtest = {
  use: true
};

botlib.makeBot('testtest', testtest);

