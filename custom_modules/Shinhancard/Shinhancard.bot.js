var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["FAN","자주 묻는 질문(FAQ)","내게 맞는 카드 추천"]}
  }
};

botlib.makeBot('Shinhancard', Shinhancard);

