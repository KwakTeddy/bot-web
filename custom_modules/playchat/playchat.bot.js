var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var playchat = {
  use: true,

  serviceName: '플레이챗',
  serviceNick: 'PlayChat',
  facebook: {
      id: '1753073741670229',
      APP_SECRET :  "085c64a8566fefe3833ed3d983623a10",
      PAGE_ACCESS_TOKEN :  "EAADbDhIZA28MBADO7Gv2f0gVUvHnng1LbriUUShxcswBXNZBukOrz8ZC9znlNMAVUpZAvWlvf83sZBMC9KxsleJcp5jUcQZCj7El4qXPIuAxRHZA68NHZCYNwQIyQP0mlc1wX6SHakz85GhfEzb5ERPQwGrHIanHvAUo71CndtAnegZDZD",
      VALIDATION_TOKEN : "moneybrain_token"
  },
  kakao: {
    keyboard: { type :"buttons", buttons:["인기봇","최신봇","마이봇","친구봇"]}
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

