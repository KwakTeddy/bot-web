var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var education = {
  use: true
};

botlib.makeBot('education', education);

