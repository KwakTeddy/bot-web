var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var lgtogether = {
  use: true
};

botlib.makeBot('lgtogether', lgtogether);

