var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('edu7');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

