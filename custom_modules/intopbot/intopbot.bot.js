var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var intopbot = {
  use: true,
  topicKeywords: ['반품','배송','구매','사이즈','입고', '재입고','주문','발송','택배','가격','결제','카드','품절','적립금','색상','취소','주문취소','상품','환불']
};

botlib.makeBot('intopbot', intopbot);

