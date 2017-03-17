var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('csdemo');
var async = require('async');
var yahooFinance = require('yahoo-finance');




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
        item.title = item.title.replace(/\|/g, ' ');
        item.description = item.description.replace(/<[^>]+>/g, '');
        item.description = item.description.replace(/<\/[^>]+>/g, '');
        item.description = item.description.replace(/&quot;/g, '\"');
        item.description = item.description.replace(/\|/g, ' ');
        context.dialog.item.push(task.doc[i]);
      }
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;
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
      item.title = item.title.replace(/\|/g, ' ');
      item.description = item.description.replace(/<[^>]+>/g, '');
      item.description = item.description.replace(/<\/[^>]+>/g, '');
      item.description = item.description.replace(/&quot;/g, '\"');
      item.description = item.description.replace(/\|/g, ' ');
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
    method: 'get',
    qs: query,
    headers: {
      'host': 'openapi.naver.com',
      'accept': '*/*',
      'content-type': 'application/json',
      'x-naver-client-id': context.bot.naver.clientid,
      'x-naver-client-secret': context.bot.naver.clientsecret
    }
  }, function(error, response, body) {
    if (!error && response.statuscode == 200) {
      // console.log(body);
      var doc = json.parse(body);
      task.doc = doc.items;
      // console.log('navernewssearch: doc=' + body);
    }
    callback(task, context);
  });
}

exports.naverNewsSearch = naverNewsSearch;

exports.exchangerate = function(task, context, callback)
{
  var query = task.inRaw;
  var request = require('request');
  context.dialog.item = [];

  request({
    url: 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s='+ query + '=X',
    method: 'get'
  }, function(error, response, body) {
    if (!error) {
      console.log(body);
      var items = body.split(',');
      task.doc = {rate: items[1], date: (items[2]+" "+items[3]).replace(/['"]+/g, '')};
      context.dialog.item.push(task.doc);
      task.count = 1;
    } else {
      task.count = 0;
    }
    callback(task,context);
  });
};

exports.stockprice = function(task, context, callback)
{
  var query = task.inRaw;
  context.dialog.item = [];

  yahooFinance.snapshot({
    symbol: query,
    fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
  }).then(function(snapshot) {
    task.doc = snapshot;
    context.dialog.item.push(task.doc);
    task.count = 1;
    console.log(JSON.stringify(snapshot, null, 2));
    callback(task,context);
  });
};
