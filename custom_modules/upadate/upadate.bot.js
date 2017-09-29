var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var upadate = {
  use: true
};

botlib.makeBot('upadate', upadate);

