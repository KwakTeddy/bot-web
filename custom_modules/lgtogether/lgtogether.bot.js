var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var lgtogether = {
  use: true
};

botlib.makeBot('lgtogether', lgtogether);

