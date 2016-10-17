
var dialogs = [
{
  input: '~추천',
  output: '이건 어떠세요?'
}
];



var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
