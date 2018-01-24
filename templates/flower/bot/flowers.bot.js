var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var blank_user0_1515733668648 = {
    use: true,
    naver: {
        clientId: 'Aqi_RlMlLRlJnmJptMhD',
        clientSecret: '0AKq2NoNgn'
    },
    kakao:{
        keyboard: {
            type:"buttons",buttons:["대화 시작"]
        }
    }

};

botlib.makeBot('blank_user0_1515733668648', blank_user0_1515733668648);
