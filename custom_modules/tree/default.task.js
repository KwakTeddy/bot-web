var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('tree');
var async = require('async');

var lgtest = {
};
bot.setTask("lgtest",lgtest);

var lgtest2 = {
};
bot.setTask("lgtest2",lgtest2);

var lgtest3 = {
};
bot.setTask("lgtest3",lgtest3);


var lglist = {
  module: 'http',
  action: "simpleRequest",
  uri: 'https://www.lgservice.co.kr/keywordSearch/simpleEasySearchPage.do',
  method: 'GET',
  param: {
    "selectKeyWord": "기구/HW",
    "category1" : 1018,
    "category2" : "C000136",
    "currentPageNo" : 1,
  },
  xpath: {
    num: '//*[@id="listCmp"]/em/text()',
    list: {
      _repeat: '//*[@id="container"]/div[2]/div[2]/div[4]/ul/li',
      link: './/div/p[1]/a/@onclick',
      title: './/div/p[1]/a/text()',
    }
  },
  postCallback: function (task, context, callback) {
    task.doc.list.forEach(function(d) {
      var res = d.link.match(/'\w+'/g);
      d.seq = res[0];
      d.itemId = res[1];
      d.gubun = res[2];
    });
    task.topTask.list = task.doc.list;
    console.log(JSON.stringify(task.doc));
    callback(task, context);
  }
};
bot.setTask("lglist", lglist);

var addrType = {
  "name": "address",
  "listName": "address",
  "typeCheck": "listTypeCheck"
};

var dateType = {
  "name": "date",
  "typeCheck": "dateTypeCheck",
  "raw": true,
  "context": true
};

bot.setType("address", addrType);
bot.setType("date", dateType);

var task2 = function() {}
bot.setTask('task2',task2);

var temptask =
{
   module: 'http',
   action: 'simpleRequest',
   uri: 'https://www.lgservice.co.kr/main.do#none',
   paramDefs: [
       {
           type: 'lotteriaMenu',
           name: 'menu',
           display: '메뉴',
           isDisplay: false,
           required: true,
           question: '주문할 메뉴를 말씀해 주세요'
       },
       {
           type: 'count',
           name: 'orderCount',
           isRequire: false,
           display: '주문개수',
           isDisplay: false,
           required: false,
           question: '주문개수를 입력해주세요'
       }
   ]
};

bot.setTask('temptask',temptask);

