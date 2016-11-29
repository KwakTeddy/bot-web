'use strict';

angular.module('core').controller('WebcsController', ['$scope', '$document', 'Authentication', 'Socket',
  function ($scope, $document, Authentication, Socket) {
    var vm = this;

    // if (!Socket.socket) {
    //   Socket.connect();
    // }

    $scope.authentication = Authentication;

    // TODO: Get Server, Bot List
    vm.servers = ['localhost:1024'];
    vm.bots = ['order'];

    vm.server = vm.servers[0];
    vm.bot = vm.bots[0];
    vm.userId = '';

    vm.msg = '';

    vm.isConnected = false;

    vm.connect = function () {
      if (!vm.userId || vm.userId.length <= 0) {
        alert('유저명을 입력해주세요!');
        return;
      }

      if (!Socket.socket) {
        Socket.connect();
      }

      vm.isConnected = true;
      init();
    };
    vm.init = init;

    vm.sendMsg = function (msg) {
      console.log('sendMsg: ' + msg);
      if (!vm.isConnected) {
        return false;
      }
      var useInput = false;
      if(!msg || msg.length <= 0) {
        msg = vm.msg;
        useInput = true;
      }
      if(!msg || msg.length <= 0) {
        return false;
      }

      if(msg == ':build') {
        build();
        return false;
      }

      if (msg == ':init') {
        init();
        return false;
      }

      addUserBubble(msg);
      emitMsg(msg);

      if(useInput) {
        vm.msg = '';
      }
    };

    vm.buildBot = function () {
      vm.sendMsg(':build');
    };
    vm.resetBot = function () {
      vm.sendMsg(':init');
    };

    // 전체화면 이벤트로 전환
    $document.bind("keydown", function(event) {
      // console.debug('keydown:' + event.keyCode)

        if(event.keyCode == 116) {    // F5
          vm.buildBot();
        } else if(event.keyCode == 27) {
          vm.resetBot();
        }
    });

    // vm.onKeyPress = function (keyCode) {
    //   if(keyCode == 116) {    // F5
    //     vm.buildBot();
    //   } else if(keyCode == 27) {
    //     vm.resetBot();
    //   }
    // };

    function build() {
      clearBubble();
      // addBotBubble('머니봇 [' + vm.bot + '] 접속 (' + vm.server.split(':')[0] + ':' + vm.server.split(':')[1] + ' as ' + vm.userId + ')');
      emitMsg(':build ' + vm.bot + ' reset');
    }

    function init() {
      clearBubble();
      // addBotBubble('머니봇 [' + vm.bot + '] 접속 (' + vm.server.split(':')[0] + ':' + vm.server.split(':')[1] + ' as ' + vm.userId + ')');
      emitMsg(':reset user');

      // setTimeout(function() {
      //   console.log('init: ' + vm.initMsg);
      //   if(vm.initMsg != undefined && vm.initMsg != null && vm.initMsg != '') emitMsg(vm.initMsg);
      // }, 200);

    }

    Socket.on('send_msg', function (message) {
      console.log('out:' + message);

      var idx = message.indexOf('url: ');
      var url;
      if(idx != -1) {
        url = message.substring(idx + 5, message.length);
        message = message.substring(0, idx );

        console.log('url:' + url);
        document.getElementById('webframe').src = url;
      }

      addBotBubble(message);
      // synthesize(message);

      var snd = new Audio('/images/doorbell-6.mp3');
      snd.play();
    });

    function emitMsg(msg) {
      Socket.emit('send_msg', {
        host: vm.server.split(':')[0],
        port: vm.server.split(':')[1],
        bot: vm.bot,
        user: vm.userId,
        msg: msg
      });
    }

    $scope.$on('$destroy', function () {
      Socket.removeListener('send_msg');
    });

    // START speech recognition
    var recognition;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var finalFinish = false, timeoutFinish = false;
    var regcognitionTimer;
    if (!('webkitSpeechRecognition' in window)) {
      console.log('upgrade');
    } else {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function() {
        console.log('recognition.onstart');

        final_transcript = '';
        recognizing = true;
      };

      recognition.onerror = function(event) {
        console.log('recognition.onerror');

        if (event.error == 'no-speech') {
          console.log('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          console.log('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            console.log('info_blocked');
          } else {
            console.log('info_denied');
          }
          ignore_onend = true;
        }
      };

      recognition.onend = function() {
        console.log('recognition.onend');

        recognition.start();

        // recognizeStart();

        recognizing = false;
        if (ignore_onend) {
          return;
        }
        if (!final_transcript) {
          console.log('info_start');
          return;
        }
        console.log('on End: ' + final_transcript);

        // vm.sendMsg(final_transcript);

        // if (window.getSelection) {
        //   window.getSelection().removeAllRanges();
        //   var range = document.createRange();
        //   range.selectNode(document.getElementById('final_span'));
        //   window.getSelection().addRange(range);
        // }
      };

      recognition.onresult = function(event) {
        console.log(event);

        // ignore_onend = false;

        var isFinal = false;
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {

          if (event.results[i].isFinal) {
            isFinal = true;
          }

          // if (event.results[i].isFinal) {
          //   final_transcript += event.results[i][0].transcript;
          //   isFinal = true;
          // } else {
          interim_transcript += event.results[i][0].transcript;
          // }
        }

        final_transcript = interim_transcript;

        if (final_transcript || interim_transcript) {
          console.log('transcript:' + interim_transcript);
        }

        if(isFinal) {
          console.log('isFinal:' + finalFinish + ',' + timeoutFinish);
          if(timeoutFinish) {
            finalFinish = false; timeoutFinish = false;
            return;
          }
          finalFinish = true;
          console.log('isFinal:' + interim_transcript);
          vm.sendMsg(interim_transcript);
        } else {

          if(regcognitionTimer) clearTimeout(regcognitionTimer);
          regcognitionTimer = setTimeout(function() {
            console.log('timeout:' + finalFinish + ',' + timeoutFinish);
            if(finalFinish) {
              finalFinish = false; timeoutFinish = false;
              return;
            } else if(timeoutFinish) return;

            timeoutFinish = true;
            console.log('timeout: ' + interim_transcript);
            if(interim_transcript != undefined && interim_transcript != '') {
              ignore_onend = true;
              vm.sendMsg(final_transcript);
            }
          }, 2000);
        }
      };
    }

    function recognizeStart() {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = 'ko-KR';
      recognition.start();
      ignore_onend = false;
      console.log('info_allow');
      start_timestamp = event.timeStamp;
    }
    // END speech recognition

    vm.bot = 'demo2';
    vm.userId = 'com2best';
    vm.connect();

    // synthesize('안녕하세요');
    recognizeStart();
  }
]);

function clearBubble() {
  var main = document.getElementById('chat_main');
  main.innerText = '';
  document.chatForm.inputbox.value = '';
}

function addBotBubble(msg) {
  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble');
  bubble.innerText = msg;
  main.appendChild(bubble);

  main.scrollTop = main.scrollHeight - main.clientHeight;
}

function addUserBubble(msg) {
  var main = document.getElementById('chat_main');
  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'bubble bubble--alt');
  bubble.innerText = msg;
  main.appendChild(bubble);

  document.chatForm.inputbox.value = '';
  main.scrollTop = main.scrollHeight - main.clientHeight;
}

function synthesize(message) {
  // recognition.stop();

  var utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'ko-KR';
  utterance.onstart = function(event) {
    console.log('synthesize start');
  };
  utterance.onerror = function(event) {
    console.log('synthesize error');
  };
  utterance.onend = function(event) {
    console.log('synthesize end');
    // recognizeStart();
  };
  window.speechSynthesis.speak(utterance);
}
