


var dialogs = [
{
  input: '배고프다',
  output: '배고프구나 뭐먹고싶어?', 
    children: [
    {
      input: '사과',
      output: '그래 배고픈데 얼른 사과 사먹어'
    }
  ]
},
{
  input: '강남역',
  output: '강남역 주변엔 모모스테이크가 맛있어요', 
    children: [
    {
      input: ['번호', '전화번호'],
      output: '강남역 모모스테이크의 전화번호 입니다.\n02-858-5683'
    }
  ]
},
{
  input: '놀다',
  output: '그래~ 뭐하고 놀래?', 
    children: [
    {
      input: '의사',
      output: '음.. 난 노래방 가고 싶어'
    }
  ]
}
];

var commonDialogs = [
{
  name: '시작',
  input: ['시작', '처음'],
  task:   {action: 'startAction'},
  output: '안녕'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('dmdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
