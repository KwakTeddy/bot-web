var path = require('path');

var orderBot = {
  dialogServer: {chatScript: false},
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
    '추천': ['좋다'],
    '이전': ['9', '전 단계']
  },

  dialogFiles: [
    'recommend.dialog.js',
    'history.dialog.js',
    'order.dialog.js',
    'etc.dialog.js'
  ]
};

var botlib = require(path.resolve('config/lib/bot'));
botlib.makeBot('order', orderBot);
