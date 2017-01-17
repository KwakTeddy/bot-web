


var dialogs = [
{
  input: 'test',
  task:   {  postCallback: function (task, context, callback) {
       console.log(JSON.stringify(task.doc));
       callback(task, context);
     }
  },
  output: 'test'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
