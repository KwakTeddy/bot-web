var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var R_consultant = {
  use: true
};

botlib.makeBot('R_consultant', R_consultant);

