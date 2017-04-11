var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAADbDhIZA28MBAPIIdHmeaT9AhlttDFsobDCvOXlEHZA6azhxqb0Mgr16rygMhrdNk9HuCh3aflN3r21J4myGV7X1DlEodwyUmojl80V0AhKt2L8kZBQP3zhrccBao7dZA2EUB5LtmypZAw7RD3r18Nib8XqE4Q18J8i2qOcotAZDZD",
      VALIDATION_TOKEN : "moneybrain_token"
  },
  kakao: {
    keyboard: { type :"buttons", buttons:["인기봇","최신봇","마이봇"]}
  },
  naver: {
    clientId: 'ovPuA5tCM5RJCopfeo6k',
    clientSecret: 'thTBSDMd9c'
  },
  dialogFiles: [
    'test.dialog.js'
  ]
};

botlib.makeBot('playchat', playchat);

