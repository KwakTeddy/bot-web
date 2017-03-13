
var path = require('path');
var type = require(path.resolve('modules/bot/action/common/type'));
var glosbe = require('./glosbe');
var wikipedia = require('./wikipedia');
var faqType = {
  typeCheck: type.mongoDbTypeCheck,
  preType: function(task, context, type, callback) {
    type.mongo.queryStatic.dialogset = context.user.userKey + '_dlg';
    callback(task, context);
  },
  limit: 5,
  mongo: {
    model: 'DialogsetDialog',
    queryStatic: {dialogset: 'Talk_2017.1.22 18:14-1_dlg'},
    queryFields: ['input'],
    fields: 'input output' ,
    taskFields: ['input', 'output'],
    taskSort: function(a, b) {
      if(b.matchCount > a.matchCount) return 1;
      else {
        return 0;
      }
    },
    minMatch: 1,
    checkRequired: function(text, type, inDoc, context) {
      return '학습되어 있지 않은 질문 입니다.';
    }
  }
}
var calculateAction = function(task, context, callback) {
    var first = task['1'];
    var second = task['3'];
    var operator = task['2'];
    if(operator == '+' || operator == '더하기') task.result = Number(first) + Number(second);
    else if(operator == '-' || operator == '빼기') task.result = Number(first) - Number(second);
    else if(operator == '*' || operator == '곱하기') task.result = Number(first) * Number(second);
    else if(operator == '/' || operator == '나누기') task.result = Number(first) / Number(second);
    else task.result = '??';
    console.log(first + ' ' + operator + ' ' + second + ' ' + task.result)
    callback(task, context);
}

var dialogs = [
{
  input: [/([^\b\s]*)(?:\b|\s).*(영어).*뭐/, /([^\b\s]*)(?:\b|\s).*(영어).*무엇/, /([^\b\s]*)(?:\b|\s).*(영어).*알다/, /([^\b\s]*)(?:\b|\s).*(영어).*알/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*뭐/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*무엇/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*알다/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*알/],
  task:   {action: glosbe.dicAction},
  output: '+1+는 +2+로 +result+입니다.'
},
{
  input: [/(\d)\s*(\+|더하기)\s*(\d)/, /(\d)\s*(\-|빼기)\s*(\d)/, /(\d)\s*(\*|곱하기)\s*(\d)/, /(\d)\s*(\/|나누기)\s*(\d)/],
  task:   {action: calculateAction},
  output: '+1+ +2+ +3+ 은 +result+ 입니다'
},
{
  input: [/([^\b\s]*)(?:\b|\s).*뭐/, /([^\b\s]*)(?:\b|\s).*무엇/, /([^\b\s]*)(?:\b|\s).*누구/, /([^\b\s]*)(?:\b|\s).*알다/, /([^\b\s]*)(?:\b|\s).*알/],
  task:   {
      preCallback: function(task, context, callback) {
          task.query = task['1'];
          console.log('wiki: ' + task['1']);
          callback(task, context);
      },
      action: wikipedia.wikiAction
  },
  output: '+doc+'
},
{
  input: {types: [faqType]},
  task:   {
      action: function(task, context, callback) {
          if(Array.isArray(task.typeDoc[0].output)) {
              task._output = task.typeDoc[0].output[0];
          } else {
              task._output = task.typeDoc[0].output;
          }
          callback(task, context);
      }
  },
  output: '+_output+'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('private_bot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
