var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAAWIPOJg3OsBANPuBUrgRfyteZCyZBPZA6aY6iRCCaYccYBkRFc0oIh6XGgEIOuN4uR3LLuCTZAH2EhbVHW1TlTAxpTbdp126RFYbT6EaV9wosudcxZAej4IS9MORf32J4ZBFZCf8pOA7D9Tzu1IujYTNWi84Oy55adTANrsGy8UQZDZD",
      VALIDATION_TOKEN : "moneybrain_token"
  },
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

botlib.makeBot('playchat', playchat);

