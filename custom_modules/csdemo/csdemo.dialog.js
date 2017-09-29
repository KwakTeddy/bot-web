


var dialogs = [

];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('csdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
