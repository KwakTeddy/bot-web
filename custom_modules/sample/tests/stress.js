var async = require('async');
var request = require('request');

var text1 = '{"user_key": "QRtjQoQse8CX",   "type": "text",   "content": "ㄱ" }';
var text2 = '{"user_key": "QRtjQoQse8CX",   "type": "text",   "content": "1" }';
var text3 = '{"user_key": "QRtjQoQse8CX",   "type": "text",   "content": "인증서" }';

var total = 0;
function stress(cb) {
  var count = 0;
  async.during(
    function (callback) {
      return callback(null, count < 1000);
    },
    function (callback) {
      count++;

      request.post({
        url: 'http://bot-dev.moneybrain.ai:3000/kakao/nh/message',
        headers: {
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: text1
      }, function (error, response, body) {
        if (error) {console.log(error); cb(null);}
        else console.log('req 1 ' + (total++)); //console.log(body);

        request.post({
          url: 'http://bot-dev.moneybrain.ai:3000/kakao/nh/message',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: text2
        }, function (error, response, body) {
          if (error) {console.log(error); cb(null);}
          else console.log('req 2 ' + (total++)); //console.log(body);

          request.post({
            url: 'http://bot-dev.moneybrain.ai:3000/kakao/nh/message',
            headers: {
              'Accept': '*/*',
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: text3
          }, function (error, response, body) {

            if (error) {console.log(error); cb(null);}
            else console.log('req 3 ' + (total++)); //console.log(body);

            callback();
          });
        });
      });
    },
    function (err) {
      cb(null);
      // 5 seconds have passed
    }
  );
}


async.parallel([
    function(cb) {
      stress(cb);
    },
    function(cb) {
      stress(cb);
    },
    function(cb) {
      stress(cb);
    },
    function(cb) {
      stress(cb);
    },
    function(cb) {
      stress(cb);
    }
  ],
  function(err, results) {
    console.log('end');
  });


// stress(function() {console.log('end')});