


var dialogs = [

];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
