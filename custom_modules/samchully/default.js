var path = require('path');
var bot = require(path.resolve('./engine/bot.js')).getBot('samchully');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var addButton = {
    action: function (task,context,callback) {
        task.buttons = [];
        callback(task,context);
    }
};

bot.setTask('addButton', addButton);
