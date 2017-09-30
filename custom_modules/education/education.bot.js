var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var education = {
  use: true
};

botlib.makeBot('education', education);

