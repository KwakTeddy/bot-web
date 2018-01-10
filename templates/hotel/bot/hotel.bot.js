var path = require('path');
var botlib = require(path.resolve('engine/bot'));

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var hotel = {
  use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["대화 시작"]}
    },
    naver: {
        clientId: 'Aqi_RlMlLRlJnmJptMhD',
        clientSecret: '0AKq2NoNgn'
    },
    commonButtons: [{"text": "이전"}, {"text": "처음"}],
    commonQuickReplies: [{"text": "이전"}, {"text": "처음"}],
    reserveFields: [
        {name: 'numOfPerson', title: '인원수'},
        {name: 'memo', title: '객실명'},
        {name: 'period', title: '기간'}
    ]
};

botlib.makeTemplateBot('hotel', hotel);

