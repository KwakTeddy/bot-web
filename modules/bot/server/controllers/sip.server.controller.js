var bot = require('../controllers/bot.server.controller');

var sip = require('sipster');
var ff = require('fluent-ffmpeg');

const fs = require('fs');
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech')();

var botId = 'csdemo';

var credential = { server: 'sip.imtel.com', id: 'com2best', password: 'Make01mb1'};
// var credential = { server: 'sip2sip.info', id: 'com2best', password: 'Make01mb1'};
// var credential = { server: 'ekiga.net', id: 'com2best', password: 'Make01mb1'};

function onMsg(text, callId) {
  var msg = {bot: botId, channel: 'phone', user: callId, msg: text};
  bot.botProc(msg.bot, msg.channel, msg.user, msg.msg, msg, function(_out, _task) {

    synthesize(_out, 'tts', function(file) {
      var player = sip.createPlayer('tts' + '.wav', true);
      player.startTransmitTo(medias[0]);
    });

  }, {});
}

function onCall(medias, callId) {
  onMsg(':reset user', callId)

  var startRecognize = function() {
    var recorder = sip.createRecorder('call.wav');
    medias[0].startTransmitTo(recorder);

    var startSpeech = false;
    var silenceCnt = 10;

    var timer = setInterval(function() {
      try {
        console.log(medias[0].txLevel + ', ' + silenceCnt + ',' + startSpeech);

        if(medias[0].txLevel < 3) {
          silenceCnt --;
        } else {
          startSpeech = true;
          silenceCnt = 10;
        }

        if(silenceCnt <= 0) {
          medias[0].stopTransmitTo(recorder);
          recorder.close();
          clearTimeout(timer);

          if(startSpeech) {
            syncRecognize('call.wav', function(data) {
              if(data.results != '' || data.endpointerType == 'END_OF_AUDIO') {
                onMsg(data.results, callId);
                startRecognize();
              }
            })
          } else {
            startRecognize();
          }
        }
      } catch(e) {
        console.log(medias[0]);
        // console.log(e);
      }
    }, 200);
  };

  startRecognize();
}



function startSIP() {
// initialize pjsip
  sip.init({
    logConfig: {level: 0}
  });

// set up a transport to listen for incoming connections, defaults to UDP
  var transport = new sip.Transport({ port: 5060 });

  var acct = new sip.Account({
    idUri: 'sip:' + credential.id + '@' + credential.server,
    regConfig: {
      registrarUri: 'sip:' + credential.server
    },
    sipConfig: {
      authCreds: [{
        scheme: 'digest',
        realm: '*',
        username: credential.id,
        dataType: 0, // plain text password
        data: credential.password
      }]
    }
  });

  acct.on('registering', function() {
    console.log('=== registering ');
  });

  acct.on('unregistering', function() {
    console.log('=== unregistering ');
  });

  acct.on('registered', function() {
    console.log('=== registered ' + 'sip:' + credential.id + '@' + credential.server);

    // streamingRecognize('out.wav', function() {
    //   console.log('streamingRecognize end');
    // })
  });

  acct.on('unregistered', function() {
    console.log('=== unregistered ');
  });

  acct.on('state', function(active, statusCode) {
    console.log('=== state ' + active + ', ' + statusCode);
  });

// watch for incoming calls
  acct.on('call', function(info, call) {
    console.log('=== Incoming call from ' + info.remoteContact);

    // watch for call state changes
    call.on('state', function(state) {
      console.log('=== Call state is now: ' + state.toUpperCase());
    });

    // listen for DTMF digits
    call.on('dtmf', function(digit) {
      console.log('=== DTMF digit received: ' + digit);
    });

    // audio stream(s) available
    call.on('media', function(medias) {
      onCall(medias, call.callId);
    });

    // answer the call (with default 200 OK)
    call.answer();
  });

  acct.setTransport(transport);
  acct.setRegistration(true);

  sip.start();
}

exports.startSIP = startSIP;

function streamingRecognize (filename, callback) {
  console.log('streamingRecognize');

  const options = {
    config: {
      // encoding: 'LINEAR16',
      sampleRate: 8000,
      languageCode: 'ko-KR'
    }
  };

  // Create a recognize stream
  const recognizeStream = speech.createRecognizeStream(options)
      .on('error', callback)
      .on('data', (data) => {
      console.log('Data received: %j', data);
    callback(data);
  });

  // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
  fs.createReadStream(filename).pipe(recognizeStream);
}

function syncRecognize (filename, callback) {
  console.log('syncRecognize');

  speech.recognize(filename, {
    // encoding: 'LINEAR16',
    // sampleRate: 16000,
    languageCode: 'ko-KR'
  }, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    console.log('Results:', results);
    callback(results);
  });
}

var client_id = 'Aqi_RlMlLRlJnmJptMhD';
var client_secret = '0AKq2NoNgn';


function synthesize(text, filename, callback) {
  var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';
  var request = require('request');
  var options = {
    url: api_url,
    form: {'speaker':'mijin', 'speed':'0', 'text':text},
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };

  var writeStream = fs.createWriteStream(filename + '.mp3');
  var _req = request.post(options).on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type'])

    ff(filename + '.mp3')
      .toFormat('wav')
      .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('progress', function (progress) {
        // console.log(JSON.stringify(progress));
        console.log('Processing: ' + progress.targetSize + ' KB converted');
      })
      .on('end', function () {
        console.log('Processing finished !');
        callback(filename)
      })
      .save('./' + filename + '.wav');
  });

  _req.pipe(writeStream); // file로 출력
}

