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
var logger = require(path.resolve('./config/lib/logger'));

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

function searchCenter (task, context, callback) {
  var center = mongo.getModel('lgcenter', undefined);  var address, lng, lat;
  task.address = context.user.address = context.dialog.address;

  addressModule.naverGeocode(task, context, function(task, context) {
    context.user.lat = context.dialog.lat = task.lat;
    context.user.lng = context.dialog.lng = task.lng;

    if(context.dialog.address) {
      address = context.dialog.address;
      lng = context.dialog.lng;
      lat = context.dialog.lat;
    } else if(context.user.address) {
      address = context.user.address;
      lng = context.user.lng;
      lat = context.user.lat;
    }

    center.find({}).lean().exec(function(err, docs) {
      if(err) {
        console.log(err);
        callback(task, context);
      } else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          doc.distance = addressModule.getDistanceFromGeocode(lat, lng, doc.lat, doc.lng);
          doc.distance = doc.distance.toPrecision(2);
          // console.log(doc.name, doc.distance, JSON.stringify(dist));
        }
        // if (i == docs.length) {
          docs.sort(function (a, b) {
            return a.distance - b.distance;
          });
        // }
        context.dialog.item = docs;

        callback(task,context)
      }
    });

  })
}

exports.searchCenter = searchCenter;

function lgGeocode(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};

  var query = {query: task._doc.address3};
  var request = require('request');

  request({
    url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
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
      task._doc.lng=doc.result.items[0].point.x;
      task._doc.lat=doc.result.items[0].point.y;
      // task.lng=task._doc.lng;
      // task.lat=task._doc.lat;
      console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
    }
    callback(task, context);
  });
}

exports.lgGeocode = lgGeocode;

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
        if(doc._doc.address3) {
          lgGeocode(doc, context, function(doc, context) {
            if(doc._doc.lng && doc._doc.lat) {
              center.update({_id:doc._doc._id},{$set:{lat:doc._doc.lat}}, function (err) {
                if(err) console.log(err);
                console.log(doc._doc.svc_center_name + ': ' + doc._doc.lng + ', ' + doc._doc.lat);
                cb(null);
              });
            } else {
              console.log(doc.svc_center_name + ': ');
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

function updateCenterAddress(task, context, callback) {

  var center = mongo.getModel('lgcenter', undefined);

  center.find({}).lean()./*limit(1000).*/exec(function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
      var address;
      if(doc.address3 != undefined && doc.address3 != '') address = {inRaw: doc.address3};
      else if(doc.address4 != undefined && doc.address4 != '') address = {inRaw: doc.address4};

      if(address == undefined) {
        logger.debug('noaddress: ' + doc.address3 + ',' + doc.address4);
        cb(null);
      } else {
        addressModule.searchAddress(address, context, function(_task, _context) {
          if(address.doc == undefined) {
            logger.debug('nodata: ' + address.inRaw);
            cb(null);
          } else if(Array.isArray(address.doc)) {
            for (var i = 0; i < address.doc.length; i++) {
              // logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].행정동명 + ' / ' + address.doc[i].도로명주소);
            }

            center.update({_id: doc._id}, {address: address.doc[0]}, {multi: true}, function(err, num) {
              cb(null);
            });

          } else if(address.doc) {
            // logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.행정동명 + ' / ' + address.doc.도로명주소 + ',' + doc._doc._id);

            center.update({_id: doc._id}, {address: address.doc}, {multi: true}, function(err, num) {
              cb(null);
            });
          }
        });
      }
    }, function(err) {
      callback(task, context);
    })
  });
}

exports.updateCenterAddress = updateCenterAddress;

function updateTime(task, context, callback) {

  var center = mongo.getModel('lgcenter', undefined);

  center.find({}).lean()./*limit(1000).*/exec(function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
      var weekopen, weekclose, satopen, satclose;
      weekopen = doc.winter_week.substring(0,5);
      weekclose = doc.winter_week.substring(5,10);
      satopen = doc.winter_sat.substring(0,5);
      satclose = doc.winter_sat.substring(5,10);

      center.update({_id: doc._id}, {winter_week_open: weekopen,winter_week_close:weekclose,winter_sat_open:satopen,winter_sat_close:satclose}, function (err,num) {
        cb(null);
      });
    }, function(err) {
      callback(task, context);
    })
  });
}

exports.updateTime = updateTime;
bot.setAction('updateTime', updateTime);

function preupdateTime(task, context, callback) {

  var center = mongo.getModel('lgcenter', undefined);

  center.find({}).lean()./*limit(1000).*/exec(function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
      var preweek, preweek2, presat, presat2;
      preweek = doc.winter_week.replace(/ /,'');
      preweek2 = preweek.replace(/~/,'');
      presat = doc.winter_sat.replace(/ /,'');
      presat2 = presat.replace(/~/,'');

      center.update({_id: doc._id}, {winter_week: preweek2, winter_sat: presat2}, function (err,num) {
        cb(null);
      });
    }, function(err) {
      callback(task, context);
    })
  });
}

exports.preupdateTime = preupdateTime;
bot.setAction('preupdateTime', preupdateTime);

function checkTime(task, context, callback) {
  var center = mongo.getModel('lgcenter', undefined);
  center.find({}).lean().exec(function(err,docs) {
    if (context.bot.testMode) {
      context.dialog.check = false;
    } else {
      var hhmm = new Date().toString().split(' ')[4].substring(0, 5);
      var day = new Date().getDay();

      if (day <= 5) {
        if (hhmm <= docs[0].winter_week_close && hhmm >= docs[0].winter_week_open) {
          context.dialog.check = false;
        } else {
          context.dialog.check = true;
        }
      } else if (day == 6) {
        if (hhmm <= docs[0].winter_sat_close && hhmm >= docs[0].winter_sat_open) {
          context.dialog.check = false;
        } else {
          context.dialog.check = true;
        }
      } else {
        context.dialog.check = true;
      }
      callback(task, context);
    }
  })
}

exports.checkTime = checkTime;