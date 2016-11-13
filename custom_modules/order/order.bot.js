var path = require('path');

var orderBot = {
  serviceName: '얌얌',
  serviceNick: '인공지능 배달봇',

  dialogServer: {chatScript: false},
  call: false,      // 배달 시 주문 전화 여부
  kakao: {
    keyboard: { type :"buttons", buttons:["배달주문시작", "배달내역보기"]}
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
  managers: [
    {platform: 'facebook', userId: '1240743695984292', name: '전용원'},
    {platform: 'facebook', userId: '1033474390107986', name: '박유진'},
    {platform: 'facebook', userId: '1314256105273043', name: '장세영'}
  ],

  messages: {
    manager:  true,
    orderCall: false
  },

  dialogFiles: [
    'history.dialog.js',
    'recommend.dialog.js',
    'etc.dialog.js',
    'order.dialog.js'
  ]
};

var botlib = require(path.resolve('config/lib/bot'));
botlib.makeBot('order', orderBot);
