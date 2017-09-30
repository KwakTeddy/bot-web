var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('ji');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

