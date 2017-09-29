var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var hoteldemo = {
  use: true
};

botlib.makeBot('hoteldemo', hoteldemo);

