var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAADbDhIZA28MBAMt0vF6IfuJWeINu2FcbKFm1PCnqP8mG8lNe7RgQQmWoQV14ld1qhrTf5MYZC53zlO7yubxEE4aZBevMwAYDqlZAs8N3yOzTPzZA5ZAqrtryfSBmWZCykzQA8XdX5m0GWMlGMaVLZAEDh5soYZBzp42W5KI5Wu9dcwZDZD",
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

