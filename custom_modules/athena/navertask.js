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


