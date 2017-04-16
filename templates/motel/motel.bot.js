var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var motel = {
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

botlib.makeTemplateBot('motel', motel);

