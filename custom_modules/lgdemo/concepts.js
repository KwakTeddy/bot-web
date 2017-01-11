var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');

var concepts = {
  '서비스센터': ['센터', '쎈터', '수리점', '센타', '쎈타', '대리점', '영업점', '고객 센터'],
  '찾다': ['알다', '궁금하다', '가르치다', '가리키다', '가르다 켜다'], //아르키다 아르 켜다 안됨
  '가다': ['가지'],
  '어디': ['어디야', '어딨다'],
  '언제': ['어느 때'],
  '어떻다':[],
  '영업': ['근무', '일 하다', '오픈', '열다', '열리다', '문여', '문 여 는', '여 는'], //'열다'동사의 '여는'형태가 자연어처리 안 됨
  '시간': ['타임', '때'], 
  '수리': [],
  '가능':[],
  '되다':[],
  '하다':[],
  '번호':['전화', '전화번호', '전번', '연락처'],
  '지하철': [],
  '버스':[],
  '자가용': ['자동차', '차'],
  '경로':[],
  '다른': ['따른', '말고']
};

bot.setConcepts(concepts);
