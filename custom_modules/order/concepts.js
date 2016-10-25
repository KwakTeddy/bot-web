var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('order');

var concepts = {
  '배달': ['주문', '시키다', '보내다'],
  '내역': ['내 역'],
  '이전': ['전 단계'],
  '처음': ['시작', '취소'],
  '전페이지': ['전', '앞'],
  '다음페이지': ['뒤', '다음'],
  '저번': ['저번', '지난번', '마지막'],
  '맛있다': ['맛나'],
  'BBQ': ['비비큐'],
  'BHC': ['비에이치씨'],
  '굽네치킨': ['goobne'],
  '네네치킨': ['nene'],
  '도미노피자': ['domino'],
  '롯데리아': ['lotteria'],
  '맘스터치': ['momstouch'],
  '맥도날드': ['mcdonald'],
  '멕시카나치킨': ['mexicana']
};

bot.setConcepts(concepts);
