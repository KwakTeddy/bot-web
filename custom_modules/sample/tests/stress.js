var async = require('async');
var request = require('request');

var host = '52.78.204.41';

var text1 = '{"user_key": "QRtjQoQse8CX",   "type": "text",   "content": "시작" }';
var text2 = '{"user_key": "QRtjQoQse8CX",   "type": "text",   "content": "FAQ" }';
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

      var _request = function(text, _ecb, _cb) {
        request.post({
          url: 'http://' + host + ':3000/kakao/nh/message',
          headers: {
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: text
        }, function (error, response, body) {
          if (error) {console.log(error); _ecb(true);}
          else {
            console.log('response ' + count + ' ' + body + '\n');
            _cb(null);
          }

        });
      };

      async.waterfall([
        function(cb1) {
          // console.log('req1 ' + count);

          setTimeout(function() {_request(text1, callback, cb1); } , 50);
        },

        function(cb1) {
          // console.log('req2 ' + count);

          setTimeout(function() {_request(text2, callback, cb1); } , 50);
        },

        function(cb1) {
          // console.log('req3 ' + count);

          setTimeout(function() {_request(text3, callback, cb1); } , 50);
        }

      ], function(err) {
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


// async.parallel([
//     // function(cb) {
//     //   stress(cb);
//     // },
//     // function(cb) {
//     //   stress(cb);
//     // },
//     // function(cb) {
//     //   stress(cb);
//     // },
//     // function(cb) {
//     //   stress(cb);
//     // },
//     function(cb) {
//       stress(cb);
//     }
//   ],
//   function(err, results) {
//     console.log('end');
//   });


// stress(function() {console.log('end')});