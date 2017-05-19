var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["시작"]}
  }
};

botlib.makeBot('Shinhancard', Shinhancard);

