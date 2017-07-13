var async = require('async');
var request = require('request');


var host = 'ec2-52-79-67-123.ap-northeast-2.compute.amazonaws.com';
var bot = 'Shinhancard';
var user = 'QRtjQoQse8CX';

var texts = [
  "시작",
  "신한 FAN을 알려줘요",
  "신한 FAN 가입"
];

var numOfThread = 10, countOfThread = 0, numOfRepeat = 10, total = 0, totalTime = 0;

function stress(cb) {
  var count = 0;
  async.during(
    function (callback) {
      return callback(null, count < numOfRepeat);
    },

    function (callback) {
      count++;
      var _request = function(text, _ecb, _cb) {
        var start1 = new Date();

        request.post({
          url: 'http://' + host + ':3000/kakao/' + bot + '/message',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: text
        }, function (error, response, body) {
          var responseTime = (new Date()) - start1;
          totalTime += responseTime;
          if (error) {console.log(error); _ecb(true);}
          else {
            console.log('response ' + count + ' ' + responseTime + '/' + totalTime + ' ' +  body + '\n');
            _cb(null);
          }

        });
        total++;
      };

      async.eachSeries(texts, function(text, cb2) {
        var text1 = '{"user_key": "' + user +'" ,   "type": "text",   "content": "' + text + '"}';

          setTimeout(function() {_request(text1, callback, cb2); } , 10);
      }, function(err) {
        callback(null);
      });
    },
    function (err) {
      console.log('end stress');
      cb(null);
      // 5 seconds have passed
    }
  );
}

var start = new Date();
console.log('[START] ' + start);
for(var i = 0; i < numOfThread; i++) {
  stress(function() {
    if(++countOfThread >= numOfThread) {
      var end = new Date();
      console.log('[END] ' + end + ', ' + total + 'req, ' + (end-start) + 'ms, ' + Math.round(total/(end-start)*1000, 2) + 'req/sec, ' +
        Math.round(totalTime /total, 2) + 'restime');
    }
  });
}
