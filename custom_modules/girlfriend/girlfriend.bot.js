var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var girlfriend = {
  use: true,
  useMemoryFacts: false,
  topicKeywords: ['이름', '중학', '노래']
};

botlib.makeBot('girlfriend', girlfriend);

