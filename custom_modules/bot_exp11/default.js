var path = require('path');
var bot = require(path.resolve('./engine/core/bot')).getBot('bot_exp11');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

