
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var test = require('./test');

var dialogs = [
{
  input: 'exec',
  task:   {action: 'executeAction'},
  output: '실행완료'
},
{
  input: 'FAQ',
  task:   test.FAQ,
  output: 'complete'
},
{
  input: 'one',
  task:   test.One,
  output: 'complete'
},
{
  input: '',
  output: '모르겠어'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 야근 테스트'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
