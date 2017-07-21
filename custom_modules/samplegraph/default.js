var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('samplegraph');

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
    if(text.match('1')) matched = true;
    else matched = false;
    task['test'] = text;
    console.log('testType: test=' + task['test'], context);
    
    callback(text, task, matched);
	}
};

bot.setType('testType', testType);

var testTask = {
  action: function (task,context,callback) {
    console.log(task['test']);
    task['test'] = 2;
    console.log('testTask: 변경 test=' + task['test'], context);
    
    callback(task,context);
	}
};

bot.setTask('testTask', testTask);

var list1 = [
  {title: '빈소1', content: '내용1'},
  {title: '빈소2', content: '내용1'},
  {title: '제목1', content: '내용1'},
  {title: '제목2', content: '내용2'}
];

var listTask1 = {
  action: function (task,context,callback) {
  	context.dialog.list1 = list1;  
    callback(task,context);
	}
};

bot.setTask('listTask1', listTask1);

var listType1 = {
  listName: 'list1',
  typeCheck: "listTypeCheck"
}

bot.setType('listType1', listType1);

var binType = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;    
    var list = [];
    for(var i = 0; i < list1.length; i++) {
      if(list1[i].title.match(text)) {
        list.push(list1[i]);
      }
    }   
    if(list.length > 0) {
      matched = true;
      context.dialog.list1 = list;
    } else {
      matched = false;
    }  
       
    callback(text, task, matched);
	}
};

bot.setType('binType', binType);

var path = require('path');
var mongoose = require(path.resolve('config/lib/mongoose.js'));
var mongo = require(path.resolve('modules/bot/action/common/mongo.js'));

var mongoType1 = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
	var faq = mongo.getModel('faqs');   
    faq.find({title: new RegExp(text)}).lean().exec(function (err, docs) {
      if(docs && docs.length > 0) {
	    context.dialog.list2 = docs;
        matched = true;
      } else {
        matched = false;
      }  
	  callback(text, task, matched);
    });  
  }
};

bot.setType('mongoType1', mongoType1);

var listType2 = {
  listName: 'list2',
  typeCheck: "listTypeCheck"
}

bot.setType('listType2', listType2);
