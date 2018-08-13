var path = require('path');
var botlib = require(path.resolve('./engine/bot'));

var delivery = {
    use: true,
    reserveFields: [
        {name: 'numOfPerson', title: '인원수'}
    ],

    naver: {
        clientId: 'Aqi_RlMlLRlJnmJptMhD',
        clientSecret: '0AKq2NoNgn'
    },

    kakao: {
        keyboard: {
            type:"buttons",buttons:["Start"]
        }
    }
};

botlib.makeTemplateBot('delivery', delivery);
