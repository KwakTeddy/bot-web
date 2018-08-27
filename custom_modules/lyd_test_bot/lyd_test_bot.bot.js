var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var lyd_test_bot = {
  use: true
};

botlib.makeBot('lyd_test_bot', lyd_test_bot);

