var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('sample');

var otherTask =
{
  action: function (task, context, callback) {
    task.result = '[OTHER TASK] hello world';
    callback(task, context);
  }
};

bot.setTask('otherTask', otherTask);

// custom_modules/sample/other.js
function otherAction(task, context, callback) {
  task.result = '[OTHER ACTION] hello world';
  callback(task, context);
}

exports.otherAction = otherAction;

