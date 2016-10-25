var path = require('path');

var orderBot = {
  dialogServer: {chatScript: false},
  call: false,      // 배달 시 주문 전화 여부
  kakao: {
    keyboard: { type :"buttons", buttons:["배달주문시작", "배달내역보기"]}
  },
  facebook: {
    id: '1006864529411088',
    APP_SECRET :  "eb2974959255583150013648e7ac5da4",
    PAGE_ACCESS_TOKEN :  "EAAJGZBCFjFukBAE63miCdcKFwqTEmbbhSbm6jIr6ws5I7fKnWSMUqIzGfHZBDTqmW0wra5xZBZCLWg2O9miPcc6WdVQRyfHdDCYuhLjIbng0njUHqOdbasHcSZAs2WEO7zG72wgmciNsF138QCq1vLnzMHR3XYIP0VnV1iZBsZAngZDZD",
    VALIDATION_TOKEN : "moneybrain_token"
  },
  managers: [
    {platform: 'facebook', userId: '1094114534004265', name: '장세영'},
    {platform: 'facebook', userId: '997804450331458', name: '테스트'}
  ],

  messages: {
    manager:  false,
    orderCall: false
  },

  concepts: {
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
    '멕시카나치킨': ['mexicana'],


  },

  dialogFiles: [
    'history.dialog.js',
    'faq.dialog.js',
    'etc.dialog.js',
    'recommend.dialog.js',
    'order.dialog.js'
  ]
};

var botlib = require(path.resolve('config/lib/bot'));
botlib.makeBot('order', orderBot);
