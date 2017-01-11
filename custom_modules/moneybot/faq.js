var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('moneybot');

var sampleList = {
  module: 'http',
  action: "simpleRequest",
  method: 'POST',
  uri: 'http://finlife.fss.or.kr/deposit/selectDeposit.do',
  param: {
    pageType: 'ajax',
    pageIndex: '1',
    pageSize: '10',
    pageUnit: '10',
    total:164,
    saveTrm:'12',
    // areaCd:'',
    // topFinGrpNo:'',
    areaCdNM: '전체',
    topFinGrpNoNM: '전체',
    joinDeny: '1',
    joinDenyNM: '제한없음',
    inputMoney: '10000000',
    // searchKeyword:'',
    // searchCondition:'',
    // intrRateType:'',
    listOrder: 'intrRateDesc',
    // logAdd:'',
    menuId: '2000100',
    BLTN_ID: 'BB000000000000000135'
  },
  xpath: {
    doc: {
      _repeat: '//*[@id="ajaxResult"]/div[1]/table/tbody/tr[@class="onOffTr"]',
      company: './/td[2]/text()',
      title: './/td[3]/text()',
      rate: './/td[4]/text()'
    },
    pages: '//div[@class="paginate"]/a[not(@class="pre") and not(@class="pre_end") and not(@class="next") and not(@class="next_end")]/text()',
    currentPage: '//div[@class="paginate"]/a[@class="pag-select"]/text()',
    nextList: '//div[@class="paginate"]/a[@class="next"]/text()',
    _postXpath: function(doc, node) {
      doc.pages = doc.pages.split(',');
      return doc;
    }
  },
  postCallback: function (task, context, callback) {
    console.log(JSON.stringify(task.doc));

    task.topTask.currentPage = task.currentPage;
    task.topTask.pages = task.pages;
    task.topTask.isNextList = !(task.nextList === undefined || task.nextList === '');

    task.topTask.doc = task.topTask.doc.concat(task.doc);

    callback(task, context);
  }
}

bot.setTask('sampleList', sampleList);


// 금감원 금융상품통합비교공시 정기예금 Crawling Sample
// http://finlife.fss.or.kr/deposit/selectDeposit.do?menuId=2000100
var sampleAll = {
  module: 'task',
  action: 'sequence',
  preCallback: function (task, context, callback) {
    task.topTask.doc = [];

    callback(task, context);
  },
  actions: [
    {
      module: 'task',
      action: 'while',
      whileIf: function(task, context) {
        if(task.topTask.isNextList === undefined) return true;
        else if(task.topTask.isNextList === true) {
          task.topTask.pages = undefined;
          return true;
        }
        else return false;
      },
      actions: [
        {
          module: 'task',
          action: 'while',
          whileIf: function(task, context) {
            if(task.topTask.currentPage === undefined) {
              task.topTask.currentPage = 1;
              return true;
            } else if(task.topTask.pages !== undefined && task.topTask.currentPage < Number(task.topTask.pages[task.topTask.pages.length -1])) {
              task.topTask.currentPage ++;
              return true;
            } else if(task.topTask.isNextList === true && task.topTask.pages === undefined) {
              task.topTask.currentPage ++;
              return true;
            }
            else return false;
          },
          actions: [
            {
              template: sampleList,
              preCallback: function (task, context, callback) {
                task.param.pageIndex = task.topTask.currentPage;
                callback(task, context);
              }
            }
          ]
        }
      ]
    },
    {
      module: 'mongo',
      action: 'update',
      mongo: {
        model: 'fssSample',
        query: {company: '', title: ''},
        options: {upsert: true}
      },
      preCallback: function (task, context, callback) {
        task.doc = task.topTask.doc;
        callback(task, context);
      }
    }
  ]
};

bot.setTask('sampleAll', sampleAll);


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
    task.topTask.doc = task.doc;

    callback(task, context);
  }
};

bot.setTask('fssFAQList', fssFAQList);

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
    // console.log(task._text);

    task.doc.date = task.doc.date.trim();
    task.doc.content = task.doc.content.trim();
    task.doc.content = task.doc.content.replace(/&amp;nbsp;/g, ' ');

    console.log(JSON.stringify(task.doc));

    task.doc.company = task.topTask.company;
    task.doc.originalId = task.param.bltnId;
    task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

bot.setTask('fssFAQ', fssFAQ);

// 금감원 금융상품통합비교공시 FAQ Crawling Sample
// http://finlife.fss.or.kr/board/selectArticleList.do?bltbId=BM000000000000000003&menuId=2000112
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
      template: fssFAQList
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
          template: fssFAQ,
          preCallback: function (task, context, callback) {
            task.param.bltnId = task.topTask.doc[task.topTask.index].originalId;
            callback(task, context);
          }
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
