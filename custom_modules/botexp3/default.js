var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('botexp3');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var test = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    context.dialog.test = text;
    callback(text, task, matched);
	}
};

bot.setType('test', test);

var options = [
  {name:"color", kind:['white', 'grey', 'black']},
  {name:"width", kind:['30', '32', '34']},
  {name:"length", kind:['90', '95', '100']},
];

var optionList = {
  typeCheck: 'listTypeCheck',
  listName: 'option'
};

bot.setType('optionList', optionList);

var makeOption = {
  action: function (task,context,callback) {
    context.dialog.optionIndex++;
    if (optionIndex == options.length) { 
      context.dialog.optionDone = true; 
      callback(task,context); 
    };
    context.dialog.optionStr += context.dialog.optionList + ', ';
    context.dialog.option = options[context.dialog.optionIndex];
    callback(task,context);
	}
};

bot.setTask('makeOption', makeOption);

var OptionStart = {
  action: function (task,context,callback) {
    if(!context.dialog.optionIndex) 
    {
      context.dialog.optionIndex = 0;
      context.dialog.option = options[0];
    };
    context.dialog.option = 
    callback(task,context);
	}
};

bot.setTask('OptionStart', OptionStart);