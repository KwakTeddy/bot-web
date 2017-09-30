


var dialogs = [
{
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '시작',
  output: 'civil_demo 입니다.'
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('civil_demo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
