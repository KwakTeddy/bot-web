var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var md_chicken = {
  use: true,
  kakao: {
      keyboard: { type :"buttons", buttons:["배달주문 시작!"]}
  },
};

botlib.makeBot('md_chicken', md_chicken);

