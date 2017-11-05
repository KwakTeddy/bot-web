var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var clubmd = {
  reserveFields: [
    {name: 'memo', title: '테이블종류'}
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  }
};

botlib.makeTemplateBot('clubmd', clubmd);

