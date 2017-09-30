
var path = require('path');
var openmarket = require('./subscribe');

var dialogs = [
{
  id: 'subscribe0',
  filename: 'subscribe',
  input: '그렇다',
  output: '그래'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('subscribeBot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
