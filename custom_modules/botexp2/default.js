var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('botexp2');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        context.dialog.exp = 
      
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);




bot.setType('testType', testType);

var sms = {
  action: messages.sendSMSAuth
};

bot.setTask('sms', sms);

var testType = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    
    callback(text, task, matched);
	}
};

bot.setType('testType', testType);