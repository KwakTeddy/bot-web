var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var weather = {
  use: true,
  useQuibble: false,
  name: '날씨봇',
  serviceName: '날씨봇',
  serviceNick: '인공지능',

  kakao: {
    keyboard: { type :"buttons", buttons:["시작"]}
  },
  naver: {
    clientId: 'c7VNVyIG3s95N4q2LWZQ',
    clientSecret: 'HXWvXdrKi7'
  },
  dialogFiles: [
    'test.dialog.js'
  ]
};

botlib.makeBot('weather', weather);

