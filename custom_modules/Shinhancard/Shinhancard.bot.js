var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["FAN","내게 맞는 카드 추천","자주 묻는 질문(FAQ)"]}
  }
};

botlib.makeBot('Shinhancard', Shinhancard);

