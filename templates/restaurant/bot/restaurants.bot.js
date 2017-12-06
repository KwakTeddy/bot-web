var path = require('path');
var botlib = require(path.resolve('engine/bot'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var restaurants = {
  reserveFields: [
    {name: 'numOfPerson', title: '인원수'}
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  },
    kakao: {
        keyboard: { type :"buttons", buttons:["대화 시작"]}
    }
};

botlib.makeTemplateBot('restaurant', restaurants);

