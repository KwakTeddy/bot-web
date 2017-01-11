


var dialogs = [
{
  input: '요호',
  output: '안녕하세요. 무엇을 도와드릴까요.'
},
{
  input: 'fssFAQ',
  task:   fssFAQ,
  output: '완료'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
