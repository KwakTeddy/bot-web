var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('edu15');

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
    if(text =='1') matched = true;
    else matched = false;
    task.test = text;
    task.test2 = "내마음";
    callback(text, task, matched);
	}
};

bot.setType('testType', testType);
var list1 = [
  {title: "빈소1", content: "좋은 빈소입니다"},
  {title: "빈소2", content: "나쁜 빈소입니다"}
]

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

var binType = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    
    var list2 = [];
    for(var i = 0; i < list1.length;i++){
    	if(list1[i].tile.match(text)){
        	list2.push(list1[i])
        }
    }
    context.dialog.list2 = list2;
    callback(text, task, matched);
	}
};

bot.setType('binType', binType);

bot.setType('mongoType1', mongoType1);