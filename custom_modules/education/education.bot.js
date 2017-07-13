var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var education = {
  use: true
};

botlib.makeBot('education', education);

