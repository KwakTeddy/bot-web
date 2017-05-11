var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('tree2');

var defaultTask = {
};
bot.setTask("defaultTask", defaultTask);

