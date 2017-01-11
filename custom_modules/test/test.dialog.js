
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
function naverGeocode(task, context, callback) {
  var query = {query: task.address.지번주소};
  var request = require('request');
  request({
    url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
    method: 'GET',
    qs: query,
    headers: {
      'Host': 'openapi.naver.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': 'c7VNVyIG3s95N4q2LWZQ',
      'X-Naver-Client-Secret': 'HXWvXdrKi7'
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      var doc = JSON.parse(body);
      task.lng=doc.result.items[0].point.x;
      task.lat=doc.result.items[0].point.y;
      console.log('lat: ' + task.lat + ', lng: ' + task.lng);
    }
    callback(task, context);
  });
};
exports.naverGeocode = naverGeocode;
function searchCenter (task,                                 context, callback) {
  var center = mongo.getModel('lgcenter', undefined);
  var address, lng, lat;
  task.address = context.dialog.address;
  addressModule.naverGeocode(task, context, function(task, context) {
    context.dialog.lat = task.lat; context.dialog.lng = task.lng;
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
        }
        if (i == docs.length) {
          docs.sort(function (a, b) {
            return a.distance - b.distance;
          });
        }
        context.dialog.item = docs;
        callback(task,context)
      }
    });
  })
}
var test = {
  name: 'test',
  action: naverGeocode
};

var dialogs = [
{
  input: 'naver',
  task:   test,
  output: '완료'
},
{
  input: '',
  output: '모르겠어'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '안녕하세요. 야근 테스트'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
