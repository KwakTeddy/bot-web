var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var Shinhancard = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["반가워요, 신한카드"]}
  },
  commonButtons: [{"text": "이전"}, {"text": "처음"}],
  commonQuickReplies: [{"text": "이전"}, {"text": "처음"}],
  intentOption: {
    // useIntent: false,
    matchRate: 0.3, matchCount: 3,
    matchRateChildOffset: 0.2, matchCountChildOffest: 2
  },
  dialogsetOption: {
    useBotDialog: false,
    useDialogset: false,
    useContext: false,
    useTopic: false,
    matchRate: 0.3, matchCount: 3,
    matchList: true, matchOneRate: 0.5, matchOneCount: 7,
    // listOutput: '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n# 번호를 입력해 주세요',
    contentOutput: '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요\n'
  }
};

botlib.makeBot('Shinhancard', Shinhancard);
