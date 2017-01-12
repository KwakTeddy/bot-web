
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
function googleGeocode(task, context, callback) {
  var request = require('request');
  var query = {address: "4250 WIBLE ROAD, BAKERSFIELD, CA", key: "AIzaSyBjZ2tk2sW3w7QEZQCTSQNCNba35kWqBjc"};
  request({
    url: 'https:\/\/maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    qs: query
  }, function(error,response,body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
      var doc = JSON.parse(body);
      task._doc.lng = doc.results[0].geometry.location.lng;
      task._doc.lat = doc.results[0].geometry.location.lat;
      task._doc.link = 'https:\/\/www.google.co.kr/maps/place/' + query.address + '/' + task._doc.lat + ',' + task._doc.lng;
      console.log(task._doc.lat);
      console.log(task._doc.link);
    }
    callback(task,context);
  });
}
var google = {
  action: googleGeocode,
  _doc: {
    lng: '',
    lat: '',
    link: ''
  }
}
var sampleType = {
  name: 'sampleType',
  typeCheck: function(text,type,task,context,callback) {
    var matched = true;
    var yolo = 'gimothee';
    callback(text,task,matched);
  }
}

var dialogs = [
{
  input: 'google',
  task:   google,
  output: 'complete'
},
{
  input: {types: [sampleType]},
  output: '+yolo+'
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
