var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var girlfriend = {
  use: true,
  useMemoryFacts: false
};

botlib.makeBot('girlfriend', girlfriend);

