var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var lgdemosimple = {
  use: true
};

botlib.makeBot('lgdemosimple', lgdemosimple);

