var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));

var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');

var ang = {
  action: geoCode,
  preCallback: function(task,context,callback) {
    task._doc.address = context.dialog.address.시도명 + ' ' + context.dialog.address.시군구명 + ' ' + context.dialog.address.행정동명;
    console.log(JSON.stringify(context.dialog.address));
    console.log(JSON.stringify(context.dialog.address.시도명));
    console.log(task._doc.address);
    callback(task, context);
  },
  _doc: {
    lng: '',
    lat: '',
    link_find: '',
    link_map: '',
    address: ''
  }
};
exports.ang = ang;

function startAction(task, context, callback) {
  context.user.address = null;
  callback(task, context);
}

bot.setAction("startAction", startAction);

function daumGeocode(task, context, callback) {
  var request = require('request');
  var query = {q: "서울특별시 금천구 가산동 464-2", output: "json"};
  request({
    url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
    method: 'GET',
    qs: query
  }, function(error,response, body) {
    if(!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      task._doc.lng = doc.channel.item[0].lng;
      task._doc.lat = doc.channel.item[0].lat;
      task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
      task._doc.link_map = 'http://map.daum.net/link/map/' + task._doc.lat + ',' + task._doc.lng;
      console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
      console.log('link: ' + task._doc.link_find);
      console.log('link: ' + task._doc.link_map);
      
    }
    callback(task,context);
  });
}
exports.daumGeocode = daumGeocode;

function geoCode(task, context, callback) {
  var request = require('request');
  var query = {q: task._doc.address, output: "json"};
  request({
    url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
    method: 'GET',
    qs: query
  }, function(error,response, body) {
    if(!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      task._doc.lng = doc.channel.item[0].lng;
      task._doc.lat = doc.channel.item[0].lat;
      task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
      task._doc.link_map = 'http://map.daum.net/link/map/' + task._doc.lat + ',' + task._doc.lng;
      console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
      console.log('link: ' + task._doc.link_find);
      console.log('link: ' + task._doc.link_map);
      
    }
    callback(task,context);
  });
}
exports.geoCode = geoCode


// 위치정보를 context.dialog.location 에 저정하기로 한다. location.lat location.lng
function locationNotExists(dialog, context, callback) {
  if(context.user.address == undefined) callback(true);
  else callback(false);
}
exports.locationNotExists = locationNotExists;

function locationExists(dialog, context, callback) {
  if(context.user.address != undefined) callback(true);
  else callback(false);
}
exports.locationExists = locationExists;


var searchCenterTask = {
  action: searchCenter,
  postCallback: function(task, context, callback) {
    callback(task, context);
  }
};
exports.searchCenterTask = searchCenterTask;

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

function timeDateType(text, type, task, context, callback) {

  // task.time 에 설정
  // task.date 에 설정

  callback(text, task, true);
}
exports.timeDateType = timeDateType;