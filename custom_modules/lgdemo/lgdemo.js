var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));

var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');
var cscenter = require('./cscenter');

function startAction(task, context, callback) {
  context.user.address = null;
  callback(task, context);
}

bot.setAction("startAction", startAction);

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
      var day = new Date().getDay();

      if (day <= 5) {
        if (context.dialog.time <= docs[0].winter_week_close && context.dialog.time >= docs[0].winter_week_open) {
          context.dialog.check = false;
        } else if (context.dialog.time == 're'){
          context.dialog.check = 're';
        } else {
          context.dialog.check = true;
        }
      } else if (day == 6) {
        if (context.dialog.time <= docs[0].winter_sat_close && context.dialog.time >= docs[0].winter_sat_open) {
          context.dialog.check = false;
        } else if (context.dialog.time == 're'){
          context.dialog.check = 're';
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

function checkDate(task, context, callback) {
  var day = context.dialog.date.getDay();

  if (day <=5) {
    context.dialog.check = false;
  } else if (day >= 6) {
    context.dialog.check = true;
  }
  callback(task, context);
}

exports.checkDate = checkDate;
