var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('junabot_1');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var listOfMyLove = [
  {key: 'myFirstLove', value: '하눈'},
  {key: 'mySecondLove', value: '쁨'},
  {key: 'myThirdLove', value: '가족'},
  {key: 'myFourthLove', value: '친구'},
  {key: 'myFifthLove', value: '바로 너'}]


var listType = {
  typeCheck: 'listTypeCheck',
  listName: 'listOfMyLove'
};

bot.setType('listType', listType);

var testTask = {
  action: function (task,context,callback) {
    context.dialog.listName = listType,
    callback(task,context);
	}
};

bot.setTask('testTask', testTask);