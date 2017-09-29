var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('./engine/core/bot')).getBot('civil_demo');

var searchCenterTask = {
  action: searchCenter,
  preCallback: function(task,context,callback) {
    task._doc.address = context.dialog.address.법정읍면동명;
    callback(task,context);
  },
  _doc: {
    link: '',
    distance: '',
    address: ''
  }
};
exports.searchCenterTask = searchCenterTask;

var locationTask = {
  action: locationNotExists,
  postCallback: function(task,context,callback) {
    console.log(task);
    console.log(context.user.address);
    callback(task,context);
  }
}
exports.locationTask = locationTask;

function locationNotExists(dialog,context,callback) {
  if(context.user.address == undefined) {
    callback(true);
  }
  else {
    callback(false);
  }
}
exports.locationNotExists = locationNotExists;

function locationExists(dialog,context,callback) {
  if(context.user != undefined && context.user.address != undefined) callback(true);
  else callback(false);
}
exports.locationExists = locationExists;

function searchCenter (task,context,callback) {
  // var center = mongo.getModel('lgcenter',undefined);
  var address, lng, lat;
  task.address = context.user.address = context.dialog.address;
  task._doc.link = 'maps.naver.com/?query=' + task._doc.address + '주민센터';
  addressModule.naverGeocode(task,context,function(task,context) {
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
    // center.find({}).lean().exec(function(err,docs) {
      // doc.distance = addressModule.getDistanceFromGeocode(lat, lng, doc.lat, doc.lng);
      // doc.distance = doc.distance.toPrecision(2);
      // callback(task,context);
    // });
    
  })
  callback(task,context);
}

exports.searchCenter = searchCenter;
