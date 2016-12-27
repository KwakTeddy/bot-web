var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('moneybot');

var fssFAQList = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://finlife.fss.or.kr/board/selectArticleList.do',
  param: {
    bltbId: 'BM000000000000000003',
    menuId: '2000112'
  },
  xpath: {
    _repeat: '//table[@class="tbl_type"]/tbody/tr',
    tag: './/td[2]/text()[0]',
    title: './/td[3]/a/text()',
    href: './/td[3]/a/@onclick',
    date: './/td[4]/text()'
  },
  postCallback: function (task, context, callback) {
    for (var i = 0; i < task.doc.length; i++) {
      var re = /fnView\('([\w\d]+)'\)/g;
      var match = re.exec(task.doc[i].href);
      task.doc[i].id = match[1];
      task.doc[i].href = undefined;
    }

    // console.log(JSON.stringify(task.doc));
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

    // console.log(JSON.stringify(task.doc));

    task.doc.company = task.topTask.company;
    task.topTask.doc[task.topTask.index] = task.doc;
    callback(task, context);
  }
};

bot.setTask('fssFAQ', fssFAQ);

var fssFAQ1 = {
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
            task.param.bltnId = task.topTask.doc[task.topTask.index].id;
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

bot.setTask('fssFAQ1', fssFAQ1);
