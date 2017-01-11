
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test2');
var fssFAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://finlife.fss.or.kr/board/selectArticle.do',
  method: 'POST',
  param: {
    menuId: '2000112',
    bltbId: 'BM000000000000000003',
    bltnId: 'BB000000000000000155'
  },
  xpath: {
    tag: '//*[@id="contents"]/div[2]/table[1]/tbody/tr[1]/td/span/span/text()',
    title: '//*[@id="contents"]/div[2]/table[1]/tbody/tr[1]/td/strong/text()',
    date: '//*[@id="contents"]/div[2]/table[1]/tbody/tr[2]/td[2]/text()',
    content: '//*[@id="contents"]/div[2]/table[1]/tbody/tr[3]/td/text()'
  },
  postCallback: function (task, context, callback) {
    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');
    task.doc.company = task.topTask.company;
    task.doc.originalId = task.param.bltnId;
    task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

var dialogs = [
{
  input: 'gimothee',
  task:   fssFAQ,
  output: '완료'
},
{
  input: '',
  output: '없다'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 1월 5일 테스트'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
