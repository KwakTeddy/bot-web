
var path = require('path');
var type = require(path.resolve('modules/bot/action/common/type'));
var glosbe = require('./glosbe');
var wikipedia = require('./wikipedia');
var news = require(path.resolve('custom_modules/newsdemo/newsdemo'));
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
    if(operator == '+' || operator == '더하기') task._result = Number(first) + Number(second);
    else if(operator == '-' || operator == '빼기') task._result = Number(first) - Number(second);
    else if(operator == '*' || operator == '곱하기') task._result = Number(first) * Number(second);
    else if(operator == '/' || operator == '나누기') task._result = Number(first) / Number(second);
    else task._result = '??';
    console.log(first + ' ' + operator + ' ' + second + ' ' + task._result)
    callback(task, context);
}

var dialogs = [
{
  id: 0,
  input: '뉴스',
  task:   {
      action: function(task, context, callback) {
          var result = [
              {
                  title: '헌재 "사법권 독립·재판 신뢰 훼손 시도 매우 우려"', text: '“심판정에서 재판 진행 방해 행위 절대 삼가해야”김평우 변호사 돌발행동·헌재 주변 ‘태극기집회’ 지적한 듯20일 오전 서울 북촌로 헌법재판소에서 이정미 헌법재판소장 권한대행 주재로 박근혜 대통령 탄핵심판 15차 변론이 …',
                  imageUrl: 'http://imgnews.naver.net/image/origin/028/2017/02/22/2354317.jpg?type=nf208_123', buttons: [{url: 'http://news.naver.com/main/hotissue/read.nhn?mid=hot&sid1=100&cid=1055281&iid=1910427&oid=028&aid=0002354317&ptype=052', text: '상세보기'}]
              },
              {
                  title: '탄핵심판 오늘 증인신문 끝…朴대통령 출석·최후변론 담판"', text: '“종착점을 향해 달려가는 헌법재판소의 탄핵심판 사건에서 박근혜 대통령의 직접 출석 여부와 최종변론일이 22일 확정된다. ',
                  imageUrl: 'http://imgnews.naver.net/image/001/2017/02/22/C0A8CA3C0000015A58F54BB800015745_P2_20170222093502747.jpeg?type=w540', buttons: [{url: 'http://news.naver.com/main/hotissue/read.nhn?mid=hot&sid1=100&cid=1055281&iid=1177095&oid=001&aid=0009054129&ptype=052', text: '상세보기'}]
              },
              {
                  title: '美·中 외교수장 "양국간 건설적 관계 중요…북핵 공동대응""', text: '“미국과 중국 양측 외교수장이 북한 핵문제에 공동 대응해 한반도를 둘러싼 지정학적 안정성을 높이기로 의견을 모았다. 또 미국과 중국 양국의 건설적인 유대관계가 중요하다는 점에 대해서도 공감했다. ',
                  imageUrl: 'http://imgnews.naver.net/image/018/2017/02/22/PS17022200334g_99_20170222103604.jpg?type=w540', buttons: [{url: 'http://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=104&oid=018&aid=0003755671', text: '상세보기'}]
              }
          ]
          task.result = {items: result};
          callback(task, context);
      }
  },
  output: '뉴스를 말씀드리겠습니다.'
},
{
  id: 1,
  input: [/([^\b\s]*)(?:\b|\s).*(영어).*뭐/, /([^\b\s]*)(?:\b|\s).*(영어).*무엇/, /([^\b\s]*)(?:\b|\s).*(영어).*알다/, /([^\b\s]*)(?:\b|\s).*(영어).*알/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*뭐/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*무엇/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*알다/, /([^\b\s]*)(?:\b|\s).*(한글|한국어).*알/],
  task:   {action: glosbe.dicAction},
  output: '+1+는 +2+로 +_result+입니다.'
},
{
  id: 2,
  input: [/(\d)\s*(\+|더하기)\s*(\d)/, /(\d)\s*(\-|빼기)\s*(\d)/, /(\d)\s*(\*|곱하기)\s*(\d)/, /(\d)\s*(\/|나누기)\s*(\d)/],
  task:   {action: calculateAction},
  output: '+1+ +2+ +3+ 은 +_result+ 입니다'
},
{
  id: 3,
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
  id: 4,
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
},
{
  id: 5,
  input: '안녕',
  output: '안녕하세요'
}
];

var commonDialogs = [
{
  id: 0,
  name: '시작',
  input: '시작',
  output: '안녕하세요. Athena 입니다.'
},
{
  id: 1,
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('athena');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);

// TEST
var json = JSON.stringify(dialogs);
console.log(json);
var fs = require('fs');
fs.writeFile(require('path').resolve("public/js") + "/dialog.json", json, function(err) {
if(err) { return console.log(err); }
console.log("dialog.json was saved!"); });