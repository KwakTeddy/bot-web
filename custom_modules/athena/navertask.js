var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var async = require('async');
var address = require(path.resolve('modules/bot/action/common/address'));


/*
exports.newscrawl = function(task, context, callback)
{
  var query = task.inRaw;
  var request = require('request');
  context.dialog.item = [];

  request({
    url: "http://news.naver.com",
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
*/

var newscrawl = {
  module: 'http',
  action: "simpleRequest",
  uri: 'http://news.naver.com',
  method: 'GET',
  xpath: {
    _repeat: '//*[@id="ranking_000"]/ul/li',
    link: './/a/@href',
    title: './/text()'
  },
  postCallback: function (task, context, callback) {
    task.doc.forEach(function(d) {
      d.title = d.title.split(',')[4];
      d.link = "http://news.naver.com" + d.link;
    });
    context.dialog.item = task.doc;
    task.count = task.doc.length;
    callback(task, context);
  }
};

bot.setTask("newscrawl", newscrawl);
exports.newscrawl = newscrawl;

function searchNaver(task, context, callback) {
    task.query=context.dialog.inRaw;

    address.naverGeoSearch(task, context, function(task, context) {
        for(var i = 0; i < task.doc.length; i++) {
            var item = task.doc[i];
            item.title = item.title.replace(/<[^>]+>/, '');
            item.title = item.title.replace(/<\/[^>]+>/, '');
        }

        if(task.doc && task.doc.length > 0) task.count = task.doc.length;
        else task.count = 0;

        context.dialog.item = task.doc;
        if (context.dialog.item.length != 0) {
            callback(task,context);
        } else {
            context.dialog.check = 're';
            callback(task, context);
        }
    });

}

exports.searchNaver = searchNaver;

function navershopping(task, context, callback) {

    var query = {query: task['1']};
    var request = require('request');

    request({
        url: 'https://openapi.naver.com/v1/search/shop.json?start=1&display=30&sort=sim',
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
            var doc = JSON.parse(body);
            // var result = [];
            // async.eachSeries(doc.items, function(doc, cb) {
            //     var _doc = {
            //         title: doc.title,
            //         text : doc.lprice + ' ~ ' + doc.hprice,
            //         imageUrl : doc.image,
            //         buttons: [{url: doc.url, text: '상세보기'}]
            //     };
            //     result.push(_doc);
            //     cb(null)
            // }, function (err) {
            //     task.result = {items: result};
            //     callback(task, context);
            // });
            context.dialog.item = doc.items;
            callback(task,context);
        }
    });
}

exports.navershopping = navershopping;

function dd (task, context, callback) {
    var result = [
        {
            title: context.dialog.item.title,
            imageUrl: context.dialog.item.image, buttons: [{url: context.dialog.item.link, text: '상세보기'}]
        }
    ]
    task.result = {items: result};
    callback(task, context);
}
