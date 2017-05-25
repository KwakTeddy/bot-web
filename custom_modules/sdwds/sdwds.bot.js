var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var sdwds = {
  use: true
};

botlib.makeBot('sdwds', sdwds);

