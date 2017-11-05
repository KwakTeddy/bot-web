var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var cafe = {
  reserveFields: [
    {name: 'numOfPerson', title: '인원수'}
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  }
};

botlib.makeTemplateBot('cafe', cafe);

