
var dialogs = [
{
  input: ['이름 뭐', '이름 무엇'],
  output: '저는 배달을 도와주는 인공지능 봇 "얌얌" 입니다.'
}
];



var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
