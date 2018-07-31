var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var HHI_BOT = {
  use: true
};

botlib.makeBot('HHI_BOT', HHI_BOT);

