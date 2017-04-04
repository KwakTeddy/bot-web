var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAAWIPOJg3OsBACCQaQbSOKqklj1QcyTgEYWA5k1LWLJVoWfJvq2AVdeNsmNA2P7hzIj6wTRxTYG0kdf2C8dgZACuvpeCIn6bb9ZAYy6GjaSAd82TR7DqxZBtsNsFfopHhVofjQhiksLGVQFnfZCdA3B02I46Rh6hHChtspgmZCAZDZD",
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

