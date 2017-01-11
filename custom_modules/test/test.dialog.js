
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
function daumGeocode(task, context, callback) {
  var request = require('request');
  var query = {q: "서울특별시 금천구 가산동 464-2", output: "json"};
  request({
    url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
    method: 'GET',
    qs: query
  }, function(error,response, body) {
    if(!error && response.statusCode == 200) {
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
function findMap(task,context,callback) {
  var request = require('request');
  request({
    url: 'http://map.daum.net',
    method: 'GET',
    qs: query
  }, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
      var doc = JSON.parse(body);
    }
    else {
      console.log('wrong');
    }
    callback(task,context);
  });
}
function lgGeocode(task, context, callback) {
  var query = {query: "서울특별시 금천구 가산동 464-2"};
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
      task._doc.lng=doc.result.items[0].point.x;
      task._doc.lat=result.items[0].point.y;
      console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
    }
    callback(task, context);
  });
}
var test = {
  action: lgGeocode,
  _doc: {
  lng: '',
  lat: ''
}
};
var mama = {
  action: daumGeocode,
  _doc: {
  lng: '',
  lat: '',
  link_find: '',
  link_map: ''
}
}

var dialogs = [
{
  input: 'naver',
  task:   test,
  output: '완료'
},
{
  input: 'daum',
  task:   mama,
  output: '완료'
},
{
  input: 'map',
  task:   findMap,
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
