var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAAWIPOJg3OsBALxnvFiVJIZBMmoOWA6RgEFxza9zCZBKQ9o6G9gwZAEIZCBNqVyWZAWr31Tifc4SqlMhevPf82eHRvgu6EW8OYWSKLOimYobhJfpeO1zmYl7nPK7AHiNOixvmA2oIE0R9ekH7Npm46MZBZAQSZAUorvQKgZCyhdULxgZDZD",
      VALIDATION_TOKEN : "moneybrain_token"
  },
  kakao: {
    keyboard: { type :"buttons", buttons:["인기봇","최신봇","마이봇"]}
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

