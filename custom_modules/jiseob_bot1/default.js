var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('jiseob_bot1');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var name = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    context.dialog.name = text+text+text;
    
    callback(text, task, matched);
	}
};

bot.setType('name', name);