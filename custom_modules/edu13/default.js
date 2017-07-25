var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('edu13');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var testtype = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    
    if(text==1) matched = true;
    else matched = false;
    
    task.test = text+'변경';
	task.test2 = text +1;
      
    callback(text, task, matched);
	}
};

bot.setType('testtype', testtype);


var list1 = [
  {title: '빈소1', content: '좋은 빈소입니다.'},
  {title: '빈소2', content: '나쁜 빈소입니다.'}
];


var testtask = {
  action: function (task,context,callback) {

    task.list1 = list1;
   	context.dialog.list1 = list1;
    callback(task,context);
	}
};

bot.setTask('testtask', testtask);

var listtype1 = {
  listName: 'list1',
  typeCheck:"listTypeCheck"
};

bot.setType('listtype1', listtype1);

var path = require(‘path’);
var mongoose = require(path.resolve(‘config/lib/mongoose.js’));
var mongo = require(path.resolve(‘modules/bot/action/common/mongo.js’));


var mongotype1 = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    
    var faq = mongo.getMdel('faqs');
    
    callback(text, task, matched);
	}
};

bot.setType('mongotype1', mongotype1);