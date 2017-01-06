var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');
var async = require('async');
var mongoose = require('mongoose');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var http = require(path.resolve('modules/bot/action/common/http'));
var task = require(path.resolve('modules/bot/action/common/task'));
var xpath = require('xpath');
var tough = require('tough-cookie');
var webdriverio = require('webdriverio');
var fs = require('fs');
var utils = require(path.resolve('modules/bot/action/common/utils'));

function searchBranch(task, context, callback) {
  task.query=context.dialog.address.시군구명 + ' ' + context.dialog.address.법정읍면동명 + ' ' + '은행';

  address.naverGeoSearch(task, context, function(task, context) {
    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/, '');
      item.title = item.title.replace(/<\/[^>]+>/, '');
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    context.dialog.item = task.doc[0];
    callback(task, context);
  });
}

exports.searchBranch = searchBranch;

function centerGeocode(task, context, callback) {
  // var center = mongoose.model('lgcenter');
  var center = mongo.getModel('lgcenter', undefined);
  // var query = {'address.시도명': '서울특별시', lng: {$exists: false}};
  // var query = {franchise: {$exists: true}, lng: {$exists: false}};
  // var query = {deliverable: true};

  center.find({}, function(err, docs) {
    if(err) {
      console.log(err);
      callback(task, context);
    } else {
      async.eachSeries(docs, function(doc, cb) {
        if(doc.address3) {
          addressModule.naverGeocode(doc, context, function(doc, context) {
            if(doc.lng && doc.lat) {
              doc.save(function (err) {
                if(err) console.log(err);
                console.log(doc.name + ': ' + doc.lng + ', ' + doc.lat);
                cb(null);
              });
            } else {
              console.log(doc.name + ': ');
              cb(null);
            }
          })
        } else {
          cb(null);
        }
      }, function(err) {
        callback(task, context);
      });
    }
  });
}

exports.centerGeocode = centerGeocode;
bot.setAction('centerGeocode', centerGeocode);
