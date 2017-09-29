var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));

var md_chicken_upgr2 = {
    use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["배달주문 시작!"]}
    },
};

botlib.makeBot('md_chicken_upgr2', md_chicken_upgr2);

