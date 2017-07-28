var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var upadate = {
  use: true
};

botlib.makeBot('upadate', upadate);

