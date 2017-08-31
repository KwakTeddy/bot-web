var async = require('async');
var request = require('request');


var host = (process.argv[2] || 'localhost');
var bot = 'Shinhancard';
var user = 'QRtjQoQse8CX';

var texts = [
  "시작",
  "신한 FAN을 알려줘요",
  "신한 FAN 가입"
];

var numOfThread = (process.argv[3] || 10), countOfThread = 0, numOfRepeat = (process.argv[4] ||  10), requestInterval = (process.argv[5] || 100), total = 0, totalTime = 0, errorCount = 0;
var _request = function(json, _ecb, _cb) {
  var start1 = new Date();
  // console.log('request: ' + total + '/' + numOfThread*texts.length*numOfRepeat + ' ' + json.content);

  request.post({
    url: 'http://' + host + ':3000/kakao/' + bot + '/message',
    'pool.maxSockets': 100000,
    agent: false,
    headers: {
      'Accept': '*/*',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json; charset=utf-8'
    },
    timeout: (Number(process.argv[5]) || 10000),
    body: JSON.stringify(json)
  }, function (error, response, body) {
    var responseTime = (new Date()) - start1;
    totalTime += responseTime;
    total++;
    if (error) {
      errorCount ++;
      console.log('response: ' + total + '/' + numOfThread*texts.length*numOfRepeat + ', error= ' + errorCount + ', ' + responseTime + 'ms ' + json.content + ' error=' + error.code);
      if(_ecb) _ecb(true);
    }
    else {
      console.log('response: ' + total + '/' + numOfThread*texts.length*numOfRepeat + ', error= ' + errorCount + ', ' + responseTime + 'ms ' + json.content/* + ' ' + body*/);
    }

    if(_cb) _cb(null);
    if(total >= numOfThread*texts.length*numOfRepeat) end();
  });
};

function stress(user1, cb) {
  var count = 0;
  async.whilst(
    function () {
      return count < numOfRepeat;
    },

    function (callback) {
      count++;

      var textId = 0;
      async.whilst(
        function () {
          return textId < texts.length;
        },

        function(callback2) {
          var json = {"user_key": user1, "type": "text", "content": texts[textId++]};
          setTimeout(function() {
            // _request(json, function() {
            //   callback2();
            // }, callback2);

            _request(json, function() {
            }, null);
            callback2()
          } , requestInterval);
        },

        function (err) {
          callback(null);
        }
      )

      // async.eachSeries(texts, function(text, cb2) {
      //   var json = {"user_key": user1, "type": "text", "content": text};
      //   setTimeout(function() {_request(json, callback, cb2); } , requestInterval);
      // }, function(err) {
      //   callback(null);
      // });
    },
    function (err) {
      cb(null);
    }
  );
}

function end() {
  var end = new Date();
  console.log('[END] star=' + start + ', numOfThread=' + numOfThread + ', numOfRepeat=' + numOfRepeat + ', requestInterval=' + requestInterval);
  console.log('[END] end=' + end + ', ' + total + 'req, error=' + errorCount + ', res=' + (end-start) + 'ms, ' +
    // Math.round(total/(reqEnd-start)*1000*100)/100 + ' req/sec, ' +
    'reqPerSec=' + Math.round(total/(end-start)*1000*100)/100 +  ', ' +
    'responseTime=' + Math.round(totalTime/total*100)/100 + 'ms');
}

var start = new Date(), reqEnd;
console.log('[START] ' + start + ', numOfThread=' + numOfThread + ', numOfRepeat=' + numOfRepeat + ', requestInterval=' + requestInterval);

// for(var i = 0; i < numOfThread; i++) {
//   var user1 = user + i;
//   stress(user1, function() {
//     if(++countOfThread >= numOfThread) {
//       reqEnd = new Date();
//     }
//   });
// }


async.whilst(
  function () {
    return countOfThread < numOfThread;
  },

  function (callback) {
    ++countOfThread;
    var user1 = user + countOfThread;
    stress(user1, function() {
      if(countOfThread >= numOfThread) {
        reqEnd = new Date();
      }
    });

    setTimeout(function() {
      callback(null);
    }, Math.max(1000/numOfThread, 1));
  },
  function (err) {
  }
);
