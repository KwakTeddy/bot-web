var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var delivery_jhs = {
  use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["배달주문 시작!"]}
    },
};

botlib.makeBot('delivery_jhs', delivery_jhs);

