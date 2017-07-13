


var dialogs = [
{
  id: 'default0',
  filename: 'default',
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  id: 'defaultcommon0',
  filename: 'defaultcommon',
  name: '시작',
  input: '시작',
  output: 'tester 입니다.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('tester');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
