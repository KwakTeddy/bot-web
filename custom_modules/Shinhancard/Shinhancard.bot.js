var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true,
  topicKeywords: ['등록','가입','결제','비밀번호','패스워드','홍채','홍채인증','지문인증','지문','인증','앱카드','FAN','OTP','폰OTP','NFC']
};

botlib.makeBot('Shinhancard', Shinhancard);

