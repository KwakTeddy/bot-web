var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var languageacademy = {
  reserveFields: [
  ],

  naver: {
    clientId: 'Aqi_RlMlLRlJnmJptMhD',
    clientSecret: '0AKq2NoNgn'
  }
};

botlib.makeTemplateBot('languageacademy', languageacademy);

