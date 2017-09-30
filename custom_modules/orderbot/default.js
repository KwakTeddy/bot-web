var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('orderbot');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var chickenList = {
	name: 'chickenList',
	action: function (task,context,callback) {
      task.result = {
        items: [
          {
            title: "허니콤보",
            text: "19000원",
            buttons: [
              {text: "주문하기"}
            ]
          },
          {
            title: "허니콤보2",
            text: "29000원",
            buttons: [
              {text: "주문하기"}
            ]
          }
        ]      
      }
      
		callback(task,context);
	}
};

bot.setTask('chickenList',chickenList);
var newTask = {
	name: 'newTask',
	action: function (task,context,callback) {
		callback(task,context);
	}
};

bot.setTask('newTask',newTask);
