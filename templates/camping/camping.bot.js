var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var camping = {
  reserveFields: [
    {name: 'numOfPerson', title: '인원수'},
    {name: 'memo', title: '객실명'},
    {name: 'period', title: '기간'}
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  }
};

botlib.makeTemplateBot('camping', camping);

