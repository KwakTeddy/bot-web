var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Shinhancard = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["시작"]}
  },
  commonButtons: [{"text": "이전단계"}, {"text": "시작메뉴"}],
  dialogsetOption: {
    matchRate: 0.3, matchCount: 3,
    useList: true,
    listMatchRate: 0.7, listMatchCount: 7,
    listOutput: '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n# 번호를 입력해 주세요1.',
    contentOutput: '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요1~\n'
  }

};

botlib.makeBot('Shinhancard', Shinhancard);

