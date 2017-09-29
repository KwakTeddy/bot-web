var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var learn = {
  use: true,
  useMemoryFacts: true,
  useQuibble: false
};

botlib.makeBot('learn', learn);

