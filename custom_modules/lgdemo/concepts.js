var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');

var concepts = {
  '서비스센터': ['센터', '수리점'],
  '찾다': ['알리다', '궁금하다'],
  '영업': ['근무'],
  '대중교통': ['지하철', '버스'],
  '자가용': ['자동차']
};

bot.setConcepts(concepts);
