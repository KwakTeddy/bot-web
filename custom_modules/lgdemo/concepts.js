var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');

var concepts = {
  '서비스센터': ['센터', '쎈터', '수리점', '센타', '쎈타', '대리점', '영업점', '고객 센터'],
  '찾다': ['찾다','알다', '궁금하다', '가르치다', '가리키다', '가르다 켜다'], //아르키다 아르 켜다 안됨
  '가다': ['가다','가지'],
  '어디': ['어디','어디야', '어딨다'],
  '언제': ['언제','어느 때', '언제까지'],
  '어떻다':['어떻다'],
  '영업': ['영업','영업하다', '근무', '일 하다', '오픈', '열다', '열리다', '문여', '문 여 는', '여 는'], //'열다'동사의 '여는'형태가 자연어처리 안 됨
  '시간': ['시간','타임', '때'], 
  '수리': ['수리'],
  '가능':['가능'],
  '되다':['되다'],
  '하다':['하다'],
  '번호':['번호','전화', '전화번호', '전번', '연락처'],
  '지하철': ['지하철', '쟈철', '전철', '서브웨이'],
  '버스':['버스','뻐스','마을 버스'],
  '자가용': ['자동차', '차'],
  '경로':['경로','가다 길'],
  '다른': ['따른', '말고'],
  '공휴일': ['공휴일', '신정', '새해 첫날', '1월 1일', '1/1', '설날', '설연휴', '삼일절', '31절', '3/1','3.1절', '석가탄신일','부처님오신날','부처님 오다 날', '어린이날', '5월 5일', '5/5', '현충일', '6월 6일', '6/6', '광복절', '8월 15일', '8/15', '추석', '추석연휴', '한가위', '개천절', '10월 3일', '10/3', '한글날', '10월 9일', '10/9', '크리스마스', '성탄절', '12월 25일', '12/25']
};

bot.setConcepts(concepts);
