
var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('private_bot');
var taskModule = require(path.resolve('./modules/bot/action/common/task'));
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
  input: 'exec',
  task:   {action: 'executeAction'},
  output: '실행완료'
},
{
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '시작',
  output: 'private_bot 입니다.'
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('private_bot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
