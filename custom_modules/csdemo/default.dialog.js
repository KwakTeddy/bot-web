


var dialogs = [
{
  id: 0,
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  id: 0,
  name: '시작',
  input: '시작',
  output: 'csdemo 입니다.'
},
{
  id: 1,
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('csdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
