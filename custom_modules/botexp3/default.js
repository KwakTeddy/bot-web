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
  {name:"color", kind:[{content:'white'}, {content:'grey'}, {content:'black'}]},
  {name:"width", kind:[{content:'30'}, {content:'32'}, {content:'34'}]},
  {name:"length", kind:[{content:'90'}, {content:'95'}, {content:'100'}]},
];

var optionList = {
  typeCheck: 'listTypeCheck',
  listName: 'option'
};

bot.setType('optionList', optionList);

var makeOption = {
  action: function (task,context,callback) {
    context.dialog.optionIndex++;
    if (context.dialog.optionIndex == options.length) { 
      context.dialog.optionDone = true; 
      callback(task,context); 
    };
    context.dialog.optionStr += context.dialog.optionList.content + ', ';
    //context.dialog.option = options[context.dialog.optionIndex];
    //context.dialog.option = options[context.dialog.optionIndex].kind;
    callback(task,context);
	}
};

bot.setTask('makeOption', makeOption);

var OptionStart = {
  action: function (task,context,callback) {
    if(!context.dialog.optionIndex) 
    {
      context.dialog.optionIndex = 0;
      context.dialog.optionStr = '';
      //context.dialog.option = options[0];
    };
    context.dialog.option = options[context.dialog.optionIndex].kind;
    callback(task,context);
	}
};

bot.setTask('OptionStart', OptionStart);
