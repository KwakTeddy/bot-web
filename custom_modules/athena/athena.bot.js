var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var athena = {
  use: true,

  name: '아테나',
  serviceName: '아테나',
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

botlib.makeBot('athena', athena);

