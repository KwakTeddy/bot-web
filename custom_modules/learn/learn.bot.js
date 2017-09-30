var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var learn = {
  use: true,
  useMemoryFacts: true,
  useQuibble: false
};

botlib.makeBot('learn', learn);

