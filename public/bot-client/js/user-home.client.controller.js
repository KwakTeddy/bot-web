'use strict';
var botClient = angular.module('botClient', []);

botClient.controller('UserHomeController', ['$scope', '$document', 'Socket',
  function ($scope, $document, Socket) {
    var vm = this;

    $scope.vm = vm;
    $scope.test = 'test1';

    vm.servers = ['localhost:1024'];
    vm.bots = ['lgdemo'];

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
      // console.log('send: ' + msg);

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

    vm.buildBot = function () { vm.sendMsg(':build'); };
    vm.resetBot = function () { vm.sendMsg(':init');  };

    function build() {
      clearBubble();
      emitMsg(':build ' + vm.bot + ' reset');
    }

    function init() {
      clearBubble();
      emitMsg(':reset user');
    }

    Socket.on('send_msg', function (message) {
      if(message.startsWith(':log')) return;
      console.log('received:' + message);

      var idx = message.indexOf('url: ');
      var url;
      if(idx != -1) {
        url = message.substring(idx + 5, message.length);
        message = message.substring(0, idx );

        // console.log('url:' + url);
        document.getElementById('webframe').src = url;
      }

      addBotBubble(message);
      // synthesize(message);

      // var snd = new Audio('/images/doorbell-6.mp3');
      // snd.play();
    });

    function emitMsg(msg) {
      console.log();

      var _msg = {
        host: vm.server.split(':')[0],
        port: vm.server.split(':')[1],
        bot: vm.bot,
        user: vm.userId,
        msg: msg
      };

      console.log('send: ' + JSON.stringify(_msg));
      Socket.emit('send_msg', _msg);
    }

    $scope.$on('$destroy', function () {
      Socket.removeListener('send_msg');
    });

    /** Key Event 등록 */
    $document.bind("keydown", function(event) {
      // console.debug('keydown:' + event.keyCode)

      if(event.keyCode == 116) {    // F5
        vm.buildBot();
      } else if(event.keyCode == 27) {
        vm.resetBot();
      }
    });


    /** 음성인식 소스 시작 */
    var recognition;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var finalFinish = false, timeoutFinish = false;
    var regcognitionTimer;
    if (!('webkitSpeechRecognition' in window)) {
      // console.log('upgrade');
    } else {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function() {
        // console.log('recognition.onstart');

        final_transcript = '';
        recognizing = true;
      };

      recognition.onerror = function(event) {
        // console.log('recognition.onerror');

        if (event.error == 'no-speech') {
          // console.log('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          // console.log('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            // console.log('info_blocked');
          } else {
            // console.log('info_denied');
          }
          ignore_onend = true;
        }
      };

      recognition.onend = function() {
        // console.log('recognition.onend');

        recognition.start();

        // recognizeStart();

        recognizing = false;
        if (ignore_onend) {
          return;
        }
        if (!final_transcript) {
          // console.log('info_start');
          return;
        }
        // console.log('on End: ' + final_transcript);

        vm.sendMsg(final_transcript);

        // if (window.getSelection) {
        //   window.getSelection().removeAllRanges();
        //   var range = document.createRange();
        //   range.selectNode(document.getElementById('final_span'));
        //   window.getSelection().addRange(range);
        // }
      };

      recognition.onresult = function(event) {
        // console.log(event);

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
          // console.log('transcript:' + interim_transcript);
        }

        if(isFinal) {
          // console.log('isFinal:' + finalFinish + ',' + timeoutFinish);
          if(timeoutFinish) {
            finalFinish = false; timeoutFinish = false;
            return;
          }
          finalFinish = true;
          // console.log('isFinal:' + interim_transcript);
          vm.sendMsg(interim_transcript);
        } else {

          if(regcognitionTimer) clearTimeout(regcognitionTimer);
          regcognitionTimer = setTimeout(function() {
            // console.log('timeout:' + finalFinish + ',' + timeoutFinish);
            if(finalFinish) {
              finalFinish = false; timeoutFinish = false;
              return;
            } else if(timeoutFinish) return;

            timeoutFinish = true;
            // console.log('timeout: ' + interim_transcript);
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
      // console.log('info_allow');
      start_timestamp = event.timeStamp;
    }
    /** 음성인식 소스 끝 */

    vm.bot = 'lgdemo';
    vm.userId = 'com2best';
    vm.connect();

    // recognizeStart();
    // recognition.stop();

    // synthesize('안녕하세요');
  }
]);

/**
 * 채팅창 UI 관련부
 */
function clearBubble() {
  var main = document.getElementById('chat_main');
  main.innerText = '';
  document.chatForm.inputbox.value = '';
}

function addBotBubble(msg) {

  var text = (msg && msg.text) ? msg.text : msg;
  console.log(vm.userBot);

  var d = new Date();
  var datetext = d.getHours() + ':' + d.getMinutes();
  var innerHTML =
    '<div class="item item-avatar b-none friend">'+
    '<img src="'+vm.userBot.imageFile+'">' +
    '<div class="text-xs"><span class="font-bold m-r-sm">'+vm.userBot.name+'</span><span class="color-grey-500">'+datetext+'</span></div>' +
    '<div class="bubble"><i class="icon-tail"></i>' +
    '<div class="content"><div class="content-text">' + text + '</div>';

  if(msg.image) {
    innerHTML += '<div ><img class="message-image" src="' + msg.image.url +'"/></div>';
  }

  if(msg.buttons) {
    for(var i in msg.buttons) {
      innerHTML += '<div class="bubble-button"><a href="' + msg.buttons[i].url + '" target="_blank">' + msg.buttons[i].text + '</a></div>';
    }
  }

  innerHTML += '</div></div>';

  innerHTML += '</div>';


  var main = document.getElementById('chat_main');
  main.insertAdjacentHTML('beforeend', innerHTML);

  // var main = document.getElementById('chat_main');
  // var bubble = document.createElement('div');
  // bubble.setAttribute('class', 'bubble');
  // if(msg.startsWith('{')) {
  //   var json = JSON.parse(msg);
  //   bubble.innerText = json.text;
  //   if(json.url) {
  //     if(json.urlMessage) bubble.innerHTML += '\n<br/><a href="' + json.url + '" target="_blank">' + json.urlMessage +'</a>';
  //     else bubble.innerHTML += '\n<br/><a href="' + json.url + '" target="_blank">' + json.url +'</a>';
  //   }
  // } else {
  //   bubble.innerText = msg;
  // }
  // main.appendChild(bubble);

  main.scrollTop = main.scrollHeight - main.clientHeight;
}

function addUserBubble(msg) {

  var main = document.getElementById('chat_main');

  var d = new Date();
  var datetext = d.getHours() + ':' + d.getMinutes();

  var bubble = document.createElement('div');
  bubble.setAttribute('class', 'item item-avatar-right b-none me');
  bubble.innerHTML =
    '<div class="text-xs"><span class="font-bold m-r-sm"></span><span class="color-grey-500">'+ datetext + '</span></div>' +
    '<div class="bubble"><i class="icon-tail-me"></i><span class="content">' + msg + '</span></div>';

  main.appendChild(bubble);

  document.chatForm.inputbox.value = '';
  main.scrollTop = main.scrollHeight - main.clientHeight;

  // var main = document.getElementById('chat_main');
  // var bubble = document.createElement('div');
  // bubble.setAttribute('class', 'bubble bubble--alt');
  // bubble.innerText = msg;
  // main.appendChild(bubble);
  //
  // document.chatForm.inputbox.value = '';
  // main.scrollTop = main.scrollHeight - main.clientHeight;
}

/**
 * 음성 합성부: Chrome에 내장된 음성 합성 사용
 *
 * @param message
 */
function synthesize(message) {
  // recognition.stop();

  var utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'ko-KR';
  utterance.onstart = function(event) {
    // console.log('synthesize start');
  };
  utterance.onerror = function(event) {
    // console.log('synthesize error');
  };
  utterance.onend = function(event) {
    // console.log('synthesize end');
    // recognition.start();
  };
  window.speechSynthesis.speak(utterance);
}

/**
 * Websocket 연결을 Angular Service 에 등록
 */
botClient.service('Socket', ['$timeout',
  function ($timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      this.socket = io();
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);
