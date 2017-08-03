var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sangwoolastbot = {
  use: true
};

botlib.makeBot('sangwoolastbot', sangwoolastbot);

