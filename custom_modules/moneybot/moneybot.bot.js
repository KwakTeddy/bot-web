var path = require('path');

var orderBot = {
  use: false,
  testMode: false,
  serviceName: '머니봇',
  serviceNick: '인공지능 금융비서',

  dialogServer: {chatScript: false},
  kakao: {
    keyboard: { type :"buttons", buttons:["계좌조회", "대출상담", "자동차보험상담", "도움말"]}
  },
  facebook: {
    id: '1166917363364364',
    APP_SECRET :  "eb2974959255583150013648e7ac5da4",
    PAGE_ACCESS_TOKEN :  "EAAJGZBCFjFukBAOhykfl9BfZBcLoDsT2G6oC7NVdhyWDSw45p3W9U8WKOKlbvunqnAFdZC2L8HPa2kkNi33fpj0v5bHZAm55WIMJlniy9ZBDaXkFZC6OBo5zU4cV7CZCq7kXrXnIEDQh9aWQbZASmiPlIAWb8fwuneaQfLqZBJpZAV4QZDZD",
    VALIDATION_TOKEN : "moneybrain_token"
  },
  line: {
    CHANNEL_ID: '1487430426',
    CHANNEL_SECRET: 'bb522efdeb637a4583807377a93ab527',
    CHANNEL_ACCESS_TOKEN: 'qEZFTLvs+VZc261MqfjfTWAdNPqqJA7Xwvrnbfmc8NWNJWXqoGCozNa174yDjm7gJM7/WNjcVIR2sqxFYF4LJNIDe1tdLe7ru04K53JzJYQopy3rjq872G2WLrcN/tI3CBaER6OotAv401QQnI57qgdB04t89/1O/w1cDnyilFU='
  },
  naver: {
    clientId: 'c7VNVyIG3s95N4q2LWZQ',
    clientSecret: 'HXWvXdrKi7'
  },

  managers: [
    {platform: 'facebook', userId: '1240743695984292', name: '전용원'},
    {platform: 'facebook', userId: '1314256105273043', name: '장세영'}
  ],

  messages: {
    manager: true,
    sms: true,
    call: false
  },
  // call: false,      // 배달 시 주문 전화 여부

  dialogFiles: [
  ]
};

var botlib = require(path.resolve('./engine/core/bot'));
botlib.makeBot('moneybot', orderBot);
