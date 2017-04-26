var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('tree');
var async = require('async');

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
