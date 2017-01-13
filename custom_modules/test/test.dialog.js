
var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('test');
var testFAQ = {
  module: 'http',
  action: "simpleRequest",
  // uri: 'http:\/\/www.kofia.or.kr/brd/m_114/list.do',
  uri: 'https://www.koreaeasyloan.com/customer/oftenQuestion.ke',
  method: 'GET',
  param: {
    page: '1'
  },
  xpath: {
    tag: '//*[@id="tbl_list"]/tbody/tr[1]/td[1]/text()',
    title: '//*[@id="tbl_list"]/tbody/tr[1]/td[2]/a/text()',
    date: '//*[@id="tbl_list"]/tbody/tr[1]/td[3]/text()',
    content: '//*[@id="tbl_list"]/tbody/tr[2]/td/text()'
  },
  postCallback: function (task, context, callback) {
    // console.log(task._text);
    console.log(JSON.stringify(task.doc));
    \/\/ task.doc.company = task.topTask.company;
    callback(task, context);
  }
};
function googleGeocode(task, context, callback) {
  var request = require('request');
  var query = {address: "4250 WIBLE ROAD, BAKERSFIELD, CA", key: "AIzaSyBjZ2tk2sW3w7QEZQCTSQNCNba35kWqBjc"};
  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    qs: query
  }, function(error,response,body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
      var doc = JSON.parse(body);
      task._doc.lng = doc.results[0].geometry.location.lng;
      task._doc.lat = doc.results[0].geometry.location.lat;
      task._doc.link = 'https://www.google.co.kr/maps/place/' + query.address + '/' + task._doc.lat + ',' + task._doc.lng;
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

var dialogs = [
{
  input: 'google',
  task:   google,
  output: 'complete'
},
{
  input: 'test',
  task:   testFAQ,
  output: 'complete'
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
