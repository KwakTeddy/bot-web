
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
function daumGeocode(task, context, callback) {
  var request = require('request');
  var query = {q: "서울특별시 금천구 가산동 464-2", output: "json"};
  request({
    url: 'https:
    method: 'GET',
    qs: query
  }, function(error,response, body) {
    if(!error && response.statusCode == 200) {
      var doc = JSON.parse(body);
      task._doc.lng = doc.channel.item[0].lng;
      task._doc.lat = doc.channel.item[0].lat;
      task._doc.link_find = 'http:
      task._doc.link_map = 'http:
      console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
      console.log('link: ' + task._doc.link_find);
      console.log('link: ' + task._doc.link_map);
    }
    callback(task,context);
  });
}

var dialogs = [
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
