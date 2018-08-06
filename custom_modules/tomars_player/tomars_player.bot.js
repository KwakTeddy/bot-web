var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var tomars_player = {
  use: true
};

botlib.makeBot('tomars_player', tomars_player);

