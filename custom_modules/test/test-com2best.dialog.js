
var testFAQ = {
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
var testFAQList = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://finlife.fss.or.kr/board/selectArticleList.do',
  param: {
    bltbId: 'BM000000000000000003',
    menuId: '2000112',
    pageIndex: '1',
  },
  xpath: {
    doc: {
      _repeat: '//table[@class="tbl_type"]/tbody/tr',
      tag: './/td[2]/text()[0]',
      title: './/td[3]/a/text()',
      originalId: './/td[3]/a/@onclick',
      date: './/td[4]/text()',
      _postXpath: function(doc, node) {
        doc.title = doc.title.trim();
        var re = /fnView\('([\w\d]+)'\)/g;
        doc.originalId = re.exec(doc.originalId)[1];
        return doc;
      }
    },
    pages: '//*[@id="contents"]/div[2]/div/div/a/text()',
    currentPage: '//*[@id="contents"]/div[2]/div/div/a[@class="pag-select"]/text()',
    _postXpath: function(doc, node) {
      doc.pages = doc.pages.split(',');
      return doc;
    }
  },
  postCallback: function (task, context, callback) {
    task.topTask.currentPage = task.currentPage;
    task.topTask.doc = task.topTask.doc.concat(task.doc);
    callback(task, context);
  }
};

var dialogs = [

];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
