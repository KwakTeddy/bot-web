var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var DLVR_BOT = {
  use: true
};

botlib.makeBot('DLVR_BOT', DLVR_BOT);

