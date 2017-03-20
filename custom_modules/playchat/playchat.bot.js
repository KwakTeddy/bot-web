var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAADbDhIZA28MBAMyYLZC1zPbmqaXg3CfqCSWbQ93ieIOOGeY2bIV74YokTtmhcSVoexSmxKGWfe6Be6WvPkxwOJmSkwG6l7oVGAf2v0khEzsu9pkQ7KO7zvDdv3wNEnJZBC92INwEDfvKT4ZAuBlfgNJYk12tshs6V8ctAf8ZCwZDZD",
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

