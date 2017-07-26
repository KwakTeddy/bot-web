var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('bot_edu12');

var chicken = [
  {title: '빈소1', content: '내용1'},
  {title: '빈소2', content: '내용1'},
  {title: '제목1', content: '내용1'},
  {title: '제목2', content: '내용2'}
];

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
    
    
    context.dialog.cd = chicken;
    callback(text, task, matched);
	}
};

bot.setType('testType', testType);

var listType = {
  typeCheck: "listTypeCheck",
  listName: "cd"
};

bot.setType('listType', listType);