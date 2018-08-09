var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('camping');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

