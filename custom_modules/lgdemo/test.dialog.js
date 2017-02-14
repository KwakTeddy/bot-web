


var dialogs = [

];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('lgdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
