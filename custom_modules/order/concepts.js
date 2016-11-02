var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('order');

var concepts = {
  '배달': ['주문', '시키다', '보내다'],
  '내역': ['내 역', '히스토리'],
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
  '멕시카나치킨': ['mexicana'],
  '파파존스': ['papazhons'],
  '페리카나': ['perikana'],
  '피자알볼로': ['pizzaalbolo'],
  '피자헛': ['pizzahut'],
  '피자헤븐': ['pizzaheaven'],
  '훌랄라참숯바베큐': ['hoolala'],
  '황금올리브': ['후라이드'],
  '갈릭': ['마늘'],
  '치즐링': ['치즈'],
  // '반반': ['양념반후라이드반'],
  '스모크': ['훈제'],
  '커리': ['카레'],
  '뿌링클': ['치즈'],
  '멕시핀': ['다리'],
  '멕시윙': ['날개'],
  '오리지날': ['간장'],
  '오리지널': ['간장'],
  '쉬림프': ['새우'],
  '슈림프': ['새우'],
  '포테이토': ['감자'],
  '신선윙': ['날개'],
  '신선핀': ['다리'],
  '어니언': ['양파'],
  '치림프': ['치즈','쉬림프']
};

bot.setConcepts(concepts);
