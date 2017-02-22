var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('csdemo');
var async = require('async');
var address = require(path.resolve('./modules/bot/action/common/address'));

function searchBranch(task, context, callback) {
  task.query=context.dialog.address.시군구명 + ' ' + context.dialog.address.법정읍면동명 + ' ' + '은행';

  address.naverGeoSearch(task, context, function(task, context) {
    context.dialog.item=[];
    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/, '');
      item.title = item.title.replace(/<\/[^>]+>/, '');
      context.dialog.item.push(task.doc[i]);
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    callback(task, context);
  });
}

exports.searchBranch = searchBranch;

var fssDepositQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'D', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['deposits'] = task.doc;
    callback(task, context);
  }
};

exports.fssDepositQuery = fssDepositQuery;


var fssSavingQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'S', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['savings'] = task.doc;
    callback(task, context);
  }
};
exports.fssSavingQuery = fssSavingQuery;


function searchNaver(task, context, callback) {
  task.query=context.dialog.inCurRaw;
  context.dialog.item = [];
  naverNewsSearch(task, context, function(task, context) {

    for(var i = 0; i < task.doc.length; i++) {
      var matched = task.doc[i].originallink.match(/chosun/);
      if (matched != null) {
        var item = task.doc[i];
        item.title = item.title.replace(/<[^>]+>/g, '');
        item.title = item.title.replace(/<\/[^>]+>/g, '');
        item.title = item.title.replace(/&quot;/g, '\"');
        item.description = item.description.replace(/<[^>]+>/g, '');
        item.description = item.description.replace(/<\/[^>]+>/g, '');
        item.description = item.description.replace(/&quot;/g, '\"');
        context.dialog.item.push(task.doc[i]);
      }
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;
    console.log('최순실'+context.dialog.item.length);
    callback(task,context);
  });

}

exports.searchNaver = searchNaver;

function searchallNaver(task, context, callback) {
  task.query=context.dialog.inCurRaw;
  context.dialog.item = [];
  naverNewsSearch(task, context, function(task, context) {

    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/g, '');
      item.title = item.title.replace(/<\/[^>]+>/g, '');
      item.title = item.title.replace(/&quot;/g, '\"');
      item.description = item.description.replace(/<[^>]+>/g, '');
      item.description = item.description.replace(/<\/[^>]+>/g, '');
      item.description = item.description.replace(/&quot;/g, '\"');
      context.dialog.item.push(task.doc[i]);
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    callback(task,context);
  });

}

exports.searchallNaver = searchallNaver;

function naverNewsSearch(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
  // console.log('naverGeoSearch');

  var query = {query: task.query};
  var request = require('request');

  // console.log('naverGeoSearch: query=' + task.query);

  request({
    url: 'https://openapi.naver.com/v1/search/news.json?&display=100&start=1',
    method: 'GET',
    qs: query,
    headers: {
      'Host': 'openapi.naver.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': context.bot.naver.clientId,
      'X-Naver-Client-Secret': context.bot.naver.clientSecret
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      task.doc = doc.items;
      // console.log('naverNewsSearch: doc=' + body);
    }
    callback(task, context);
  });
}

exports.naverNewsSearch = naverNewsSearch;
