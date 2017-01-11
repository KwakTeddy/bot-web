
# Created By ...

var dialogs = [
{
  name: '시작',
  input: '안녕',
  output: '1월 3일 테스트'
},
{
  input: '찾다',
  output: '무엇을 찾으시나요?'
},
{
  input: /구글 (.*) 찾다/,
  task:   // .dlg 파일에서 저장한 변수 호출
  googleTask,
  output: 'Google에서 +1+을 검색했습니다. '
},
{
  input: '',
  output: '응 잘못 만들었어'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
