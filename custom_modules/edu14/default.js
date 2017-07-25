var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('edu14');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var testType = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    if(text == 1) matched = true;
    else matched = false;
    
    task.test = text;
    
    
    callback(text, task, matched);
	}
};

bot.setType('testType', testType);

var list1 = [
  {title: "빈소1", content:"빈소1입니다."},
  {title: "빈소2", content:"빈소2입니다."}
];
var testTask = {
  action: function (task,context,callback) {
    
    task.list1 = list1;
    context.dialog.list1 = list1;
    callback(task,context);
	}
};

bot.setTask('testTask', testTask);

var listType1 = {
  listName: "list1",
  typeCheck: "listTypeCheck"
};

bot.setType('listType1', listType1);

var path = require(‘path’);
var mongoose = require(path.resolve(‘config/lib/mongoose.js’));
var mongo = require(path.resolve(‘modules/bot/action/common/mongo.js’));

var mongoType1 = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    
    var faq = mongo.getModel('faqs');
    faq.findById({}).lean().exec(function (err, docs) {
      task.list1 = docs;
      callback(text, task, matched);
    });
	}
};

bot.setType('mongoType1', mongoType1);