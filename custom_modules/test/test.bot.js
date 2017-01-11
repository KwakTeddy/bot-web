var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var testBot = {
  use: true,

  serviceName: 'test',
  serviceNick: 'test',

  kakao: {
  },
  facebook: {
  },
  line: {
  },
  naver: {
  }
};

botlib.makeBot('test', testBot);

