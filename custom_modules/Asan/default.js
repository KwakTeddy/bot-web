var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('Asan');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var 빈소테스크 = {
	name: '빈소테스크',
	action: function (task,context,callback) {
      
		callback(task,context);
	}
};

bot.setTask('빈소테스크',빈소테스크);

var 빈소Type = {
	name: '빈소Type',
	typeCheck: function (text, type, task, context, callback) {
	  var matched = true; 매치여부
	  callback(text, task, matched);
	}
}

bot.setType('빈소Type',빈소Type);


var binsoTask = {
  action: function (task,context,callback) {
    task.image = 'http://cfile29.uf.tistory.com/image/2573C6425266286E348CD9';
    callback(task,context);
	}
};

bot.setTask('binsoTask', binsoTask);