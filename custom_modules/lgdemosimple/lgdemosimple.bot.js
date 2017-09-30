var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var lgdemosimple = {
  use: true
};

botlib.makeBot('lgdemosimple', lgdemosimple);

