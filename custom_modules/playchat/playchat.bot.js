var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAADbDhIZA28MBAN57EnHz68RJGtRf2qcIlDwrNkNIEoidaIqBwPZADw7UkTU3MYrEbvDH4IWlYIfqJzZBEMvIFCnAmAmn6EZCRUDfELa5q3HbaaqUkfAPQ1mjKzWyLZA6eH0HgYWKgL81ljAgAGHy1M3YAZBBPZBnEGdsWe93UFAAZDZD",
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

