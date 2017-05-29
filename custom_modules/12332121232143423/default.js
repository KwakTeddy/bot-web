var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('12332121232143423');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

