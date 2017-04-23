var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test = {
  use: true,
  serviceName: 'Coupang',
  serviceNick: 'Coupang',
  kakao: {
    keyboard: { type :"buttons", buttons:["개발 테스트용입니다"]}
  },
};

botlib.makeBot('test', test);

