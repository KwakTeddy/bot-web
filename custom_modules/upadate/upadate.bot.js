var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var upadate = {
  use: true
};

botlib.makeBot('upadate', upadate);

