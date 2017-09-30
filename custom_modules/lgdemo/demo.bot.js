var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var lgdemoBot = {
  use: true,

  name: 'LG 고객센터',
  serviceName: 'LG Demo',
  serviceNick: 'LG Demo',

  kakao: {
    keyboard: { type :"buttons", buttons:["시작"]}
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
  dialogFiles: [
    'lgdemo.dialog.js'
  ]
};

botlib.makeBot('lgdemo', lgdemoBot);

