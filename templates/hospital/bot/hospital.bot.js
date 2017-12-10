var path = require('path');
var botlib = require(path.resolve('engine/bot'));

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hospital = {
    // reserveFields: [
    //     {name: 'time', title: '서비스명'}
    // ],

    naver: {
        clientId: 'Aqi_RlMlLRlJnmJptMhD',
        clientSecret: '0AKq2NoNgn'
    },
    use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["대화시작"]}
    },
    commonButtons: [{"text": "이전"}, {"text": "처음"}],
    commonQuickReplies: [{"text": "이전"}, {"text": "처음"}]
};

botlib.makeTemplateBot('hospital', hospital);

