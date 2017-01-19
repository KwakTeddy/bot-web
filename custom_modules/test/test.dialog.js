
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
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
var testPage = {
  module: 'task',
  action: 'sequence',
  preCallback: function (task, context, callback) {
    task.topTask.index = -1;
    task.topTask.company = '금감원-금융상품통합비교공시';
    task.topTask.doc = [];
    callback(task, context);
  },
  actions: [
    {
      template: testFAQList
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
          template: testFAQ,
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
        model: 'fnfaq',
        query: {company: '','originalId': ''},
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
function googleGeocode(task, context, callback) {
  var request = require('request');
  var query = {address: "4250 WIBLE ROAD, BAKERSFIELD, CA", key: "AIzaSyBjZ2tk2sW3w7QEZQCTSQNCNba35kWqBjc"};
  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    qs: query
  }, function(error,response,body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
      var doc = JSON.parse(body);
      task._doc.lng = doc.results[0].geometry.location.lng;
      task._doc.lat = doc.results[0].geometry.location.lat;
      task._doc.link = 'https://www.google.co.kr/maps/place/' + query.address + '/' + task._doc.lat + ',' + task._doc.lng;
      console.log(task._doc.lat);
      console.log(task._doc.link);
    }
    callback(task,context);
  });
}
var google = {
  action: googleGeocode,
  _doc: {
    lng: '',
    lat: '',
    link: ''
  }
}

var dialogs = [
{
  input: 'google',
  task:   google,
  output: 'complete'
},
{
  input: 'test',
  task:   testFAQ,
  output: 'complete'
},
{
  input: '',
  output: '모르겠어'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 야근 테스트'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
