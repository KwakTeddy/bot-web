var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('test');

var FAQTotalList = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://finlife.fss.or.kr/board/selectArticleList.do',
  param: {
    bltbId: 'BM000000000000000003',
    menuId: '2000112'
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
    task.topTask.pages = task.pages;
    task.topTask.doc = task.topTask.doc.concat(task.doc);
    callback(task, context);
  }
};

bot.setTask('FAQTotalList', FAQTotalList);
exports.FAQTotalList = FAQTotalList;


var FAQList = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.knia.or.kr/consumer/counsel/counsel02/',
  param: {
    page: '1'
  },
  xpath: {
    doc: {
      _repeat: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr',
      tag: './/*[@class="question"]/text()',
      title: './/*[@class="faq"]/text()',
      originalId: './/*[@class="faq-content"]/td[1]/text()',
      date: './/*[@class="answer"]/text()',
      _postXpath: function(doc, node) {
        doc.title = doc.title.trim();
        var re = /fnView\('([\w\d]+)'\)/g;
        // doc.originalId = re.exec(doc.originalId)[1];
        return doc;
      }
    },
    pages: '/html/body/div/div[3]/div/div[2]/div[2]/table/tfoot/tr/td/ul/li/text()',
    currentPage: '/html/body/div/div[3]/div/div[2]/div[2]/table/tfoot/tr/td/ul/li[1]/text()',
    _postXpath: function(doc, node) {
      doc.pages = doc.pages.split(',');
      return doc;
    }
  },
  postCallback: function (task, context, callback) {
    task.topTask.doc = task.doc;
    console.log(task.doc);
    callback(task, context);
  }
};

bot.setTask('FAQList', FAQList);
exports.FAQList = FAQList;

var FAQ = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://www.knia.or.kr/consumer/counsel/counsel02/',
  method: 'POST',
  param: {
    page: '1'
  },
  xpath: {
    tag: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[1]/th/text()',
    title: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[1]/td/text()',
    date: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[2]/th/text()',
    content: '/html/body/div/div[3]/div/div[2]/div[2]/table/tbody/tr[2]/td/text()'
  },
  postCallback: function (task, context, callback) {
    console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    // task.doc.company = task.topTask.company;
    // task.doc.originalId = task.param.bltnId;
    // task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

bot.setTask('FAQ', FAQ);
exports.FAQ = FAQ;

// 금감원 금융상품통합비교공시 FAQ Crawling Sample
// http://finlife.fss.or.kr/board/selectArticleList.do?bltbId=BM000000000000000003&menuId=2000112
var FAQAll = {
  module: 'task',
  action: 'sequence',
  preCallback: function (task, context, callback) {
    task.topTask.index = -1;
    task.topTask.company = '손해보험협회';
    callback(task, context);
  },
  actions: [
    {
      template: FAQList
    },
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
        if(task.topTask.index === undefined) {
          task.topTask.index = 0;
          return true;
        } else if(task.topTask.doc.length - 1 > task.topTask.index) {
          task.topTask.index ++;
          return true;
        } else {
          return false;
        }
      },
      actions: [
        {
          template: FAQ,
          preCallback: function (task, context, callback) {
            task.param.page = task.topTask.doc[task.topTask.index].originalId;
            callback(task, context);
          }
        }
      ]
    },
    {
      module: 'mongo',
      action: 'update',
      mongo: {
        model: 'fnfaq',
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

bot.setTask('FAQAll', FAQAll);
exports.FAQAll = FAQAll;

var FAQTotal = {
  module: 'task',
  action: 'sequence',
  preCallback: function(task,context,callback) {
    task.topTask.index = -1;
    task.topTask.company = '금감원-금융상품통합비교공시';
    task.topTask.doc = [];
    callback(task,context);
  },
  actions: [
    {
      module: 'task',
      action: 'while',
      whileIf: function(task,context) {
        if(task.topTask.currentPage == undefined) {
          task.topTask.currentPage = 1;
          return true;
        } else if(task.topTask.currentPage !== undefined && task.topTask.currentPage < Number(task.topTask.pages[task.topTask.pages.length -1])) {
          task.topTask.currentPage ++;
          return true;
        } else if(task.topTask.pages == undefined) {
          task.topTask.currentPage ++;
          return true;
        } else return false;
      },
      actions: [
        {
          template: 'FAQTotalList'
        },
        {
          module: 'task',
          action: 'while',
          whileIf: function(task,context) {
            if(task.topTask.index == undefined) {
              task.topTask.index = 0;
              return true;
            } else if(task.topTask.doc.length - 1 > task.topTask.index) {
              task.topTask.index ++;
              return true;
            } else {
              return false;
            }
          },
          actions: [
            {
              template: 'FAQ',
              preCallback: function(task,context,callback) {
                task.param.bltnId = task.topTask.doc[task.topTask.index].originalId;
                callback(task,context);
              }
            }
          ]
        }
      ]
    }
  ],
  postCallback: function(task,context,callback) {
    // console.log(JSON.stringify(task.topTask.doc));
    console.log(task.topTask.doc);
    callback(task,context);
  }
}

bot.setTask('FAQTotal', FAQTotal);
exports.FAQTotal = FAQTotal;

var FAQTest = {
 module: 'task',
 action: 'sequence',
 preCallback: function(task,context,callback) {
  task.topTask.index = -1;
  task.topTask.company = '금감원-금융상품통합비교공시';
  task.topTask.doc = [];
  callback(task,context);
 },
 actions: [
  {
   module: 'task',
   action: 'while',
   whileIf: function(task,context) {
    if(task.topTask.currentPage == undefined) {
     task.topTask.currentPage = 1;
     return true;
    } else if(task.topTask.currentPage !== undefined && task.topTask.currentPage < Number(task.topTask.pages[task.topTask.pages.length-1])) {
     task.topTask.currentPage ++;
     return true;
    } else if(task.topTask.pages == undefined) {
     task.topTask.currentPage ++;
     return true;
    } else return false;
   },
   actions: [
    {
     template: 'FAQTestAll',
     postCallback: function(task,context,callback) {
       task.param.pageIndex = task.topTask.currentPage;
       callback(task,context);
     }
    }
   ]
  }
 ],
 postCallback: function(task,context,callback) {
  console.log(task.topTask.doc);
  callback(task,context);
 }
}
exports.FAQTest = FAQTest;
bot.setTask('FAQTest', FAQTest);

var FAQTestAll = {
  module: 'task',
  action: 'sequence',
  param: {
    pageIndex: '1'
  },
  preCallback: function (task, context, callback) {
    task.topTask.index = -1;
    task.topTask.company = '금감원-금융상품통합비교공시';
    // task.topTask.pageIndex = 0;
    // task.topTask.doc = [];
    callback(task, context);
  },
  actions: [
    {
      template: 'FAQTotalList'
    },
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
        if(task.topTask.index === undefined) {
          task.topTask.index = 0;
          return true;
        } else if(task.topTask.doc.length - 1 > task.topTask.index) {
          task.topTask.index ++;
          return true;
        } else {
          return false;
        }
      },
      actions: [
        {
          template: 'FAQ',
          preCallback: function (task, context, callback) {
            task.param.bltnId = task.topTask.doc[task.topTask.index].originalId;
            callback(task, context);
          }
        }
      ]
    }
  ],
  postCallback: function (task, context, callback) {
    console.log(JSON.stringify(task.topTask.doc));
    callback(task, context);
  }
};

bot.setTask('FAQTestAll', FAQTestAll);
exports.FAQTestAll = FAQTestAll;