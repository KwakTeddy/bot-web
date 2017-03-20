var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var athena = {
  use: true,

  serviceName: '아테나',
  serviceNick: '인공지능',

  kakao: {
    keyboard: { type :"buttons", buttons:["인기봇","최신봇","친구봇","마이봇"]}
  },
  naver: {
    clientId: 'c7VNVyIG3s95N4q2LWZQ',
    clientSecret: 'HXWvXdrKi7'
  },
  dialogFiles: [
    'test.dialog.js'
  ]
};

botlib.makeBot('athena', athena);

