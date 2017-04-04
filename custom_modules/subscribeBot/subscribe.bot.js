var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var subscribeBot = {
  use: true,
  testMode: true,
  name: '페이스북',
  serviceName: '페북',
  serviceNick: '페이스북 페이지',
  facebook: {
      VALIDATION_TOKEN : "moneybrain_token"
  },
};

botlib.makeBot('subscribeBot', subscribeBot);

