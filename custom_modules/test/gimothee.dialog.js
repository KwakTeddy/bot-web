
# Created By ...
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
var fssFAQList = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://finlife.fss.or.kr/board/selectArticleList.do',
  param: {
    bltbId: 'BM000000000000000003',
    menuId: '2000112'
  },
  xpath: {
    doc: {
      _repeat: '//table[@class="tbl_type"]/tbody/tr',			// 한 페이지에 있는 질문 하나씩 지정
      tag: './/td[2]/text()[0]',								// [2]랑 [3] 차이?
      title: './/td[3]/a/text()',								// 각 질문의 제목
      originalId: './/td[3]/a/@onclick',						// 각 질문 답변에 대한 클릭 링크
      date: './/td[4]/text()',									// 각 질문의 날짜
      _postXpath: function(doc, node) {
        doc.title = doc.title.trim();							// 빈칸 빼고 넣는 것이라고 하신듯?
        var re = /fnView\('([\w\d]+)'\)/g;						// typecast 비슷한듯
        doc.originalId = re.exec(doc.originalId)[1];			// ?? originalId .doc에 저장한듯
        return doc;
      }
    },
    pages: '//*[@id="contents"]/div[2]/div/div/a/text()',		// 말 그대로 각 페이지
    currentPage: '//*[@id="contents"]/div[2]/div/div/a[@class="pag-select"]/text()',		// 현 페이지
    _postXpath: function(doc, node) {
      doc.pages = doc.pages.split(',');
      return doc;
    }
  },
  postCallback: function (task, context, callback) {
    console.log(JSON.stringify(task.doc));
    task.topTask.currentPage = task.currentPage;
    task.topTask.pages = task.pages;
    task.topTask.doc = task.topTask.doc.concat(task.doc);
    callback(task, context);
  }
};
bot.setTask('fssFAQList', fssFAQList);
var fssFAQAll = {
  module: 'task',
  action: 'sequence',
  preCallback: function (task, context, callback) {
    task.topTask.index = -1;
    task.topTask.company = '금감원-금융상품통합비교공시';
    callback(task, context);
  },
  actions: [
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
      	if(task.topTask.currentPage == undefined) {
        	task.topTask.currentPage = 1;
          	return true;
        } else if(task.topTask.pages !== undefined && task.topTask.currentPage < Number(task.topTask.pages[task.topTask.pages.length - 1])) {
        	task.topTask.currentPage++;
          	return true;
        }
        else return false;
      }
      ]
    },
    {
      module: 'mongo',
      action: 'update',
      mongo: {
        model: 'fssFAQ',
        query: {'originalId': ''},
        options: {upsert: true}
      },
      preCallback: function (task, context, callback) {
        task.doc = task.topTask.doc;
        callback(task, context);
      }
    }
  ],
  postCallback: function (task, context, callback) {
    console.log(JSON.stringify(task.topTask.doc));
    callback(task, context);
  }
};
bot.setTask('fssFAQAll', fssFAQAll);

var dialogs = [

];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
