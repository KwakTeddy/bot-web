var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var hairshop = {
  reserveFields: [
    {name: 'memo', title: '서비스명'}
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  }
};

botlib.makeTemplateBot('hairshop', hairshop);

