
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var taskModule = require(path.resolve('./modules/bot/action/common/task'));
var bot = require(path.resolve('config/lib/bot')).getBot('moneybot');
/*
execute "taskName in bot"
execute "module.task"
    1. module js in bot folder, exports task
    2. module js in common actions,  exports task
    3. module js path, exports task
*/
var executeAction = function(task, context, callback) {
  var words = context.dialog.inRaw.split(' ');
  var _task = bot.tasks[words[1]];
  taskModule.executeTask(_task, context, function(_task, context) {
    callback(_task, context);
  });
}
bot.setAction('executeAction', executeAction);

var dialogs = [
{
  input: '네이버',
  task:   {action: address.naverGeoSearch},
  output: '네이버 결과 입니다'
},
{
  input: ['땡큐', '고맙다', '감사', /^ㄱㅅ$/],
  output: '이용해 주셔서 감사합니다.'
},
{
  input: '실행',
  task:   {action: 'executeAction'},
  output: '실행완료\n ##+company+ +title+\n#'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
