'use strict';
var botClient = angular.module('botClient', ['angularFileUpload', 'ngResource', 'ngCookies']);

botClient.controller('PrivateBotController', ['$scope', '$document', '$timeout', '$window', '$resource', '$cookies', 'Socket', 'FileUploader',
  function ($scope, $document, $timeout, $window, $resource, $cookies, Socket, FileUploader) {
    var vm = this;

    $scope.vm = vm;
    $scope.test = 'test1';



    // if (!Socket.socket) {
    //   Socket.connect();
    // }

//    $scope.authentication = Authentication;

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

      if(message.startsWith(':log')) return;

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

      // var snd = new Audio('/images/doorbell-6.mp3');
      // snd.play();
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
        // console.log('recognition.onstart');

        final_transcript = '';
        recognizing = true;
      };

      recognition.onerror = function(event) {
        // console.log('recognition.onerror');

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

    vm.bot = 'private_bot';

    if($cookies.get('userId') == undefined) {
      vm.userId = generateUUID();
      $cookies.put('userId', vm.userId);
    } else {
      vm.userId = $cookies.get('userId');
    }
    vm.connect();

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: '/api/core/files/' + vm.userId,
      alias: 'uploadFile'
    });

    // $scope.uploader.filters.push({
    //   name: 'imageFilter',
    //   fn: function (item, options) {
    //     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //     return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //   }
    // });


    // $scope.uploader.filters.push({
    //   name: 'fileFilter',
    //   fn: function (item, options) {
    //     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //     return '|txt|csv|'.indexOf(type) !== -1;
    //   }
    // });

    var filename = '';
    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // var User = $resource('/user/:userId', {userId:'@id'});

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      var Convert = $resource('/api/core/convert', null, {});
      var _convert = new Convert({filename: response.filename});
      _convert.$save(function() {
        $scope.successConvert = true;
      });

      // Convert.update({id: ''}, {filename: fileItem.file.name});

      // Populate user object
      // $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadDialogFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };


    // recognizeStart();
    // recognition.stop();

    // synthesize('안녕하세요');
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
  if(msg.startsWith('{')) {
    var json = JSON.parse(msg);
    bubble.innerText = json.text;
    if(json.url) {
      if(json.urlMessage) bubble.innerHTML += '\n<br/><a href="' + json.url + '" target="_blank">' + json.urlMessage +'</a>';
      else bubble.innerHTML += '\n<br/><a href="' + json.url + '" target="_blank">' + json.url +'</a>';
    }
  } else {
    bubble.innerText = msg;
  }
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
    // recognition.start();
  };
  window.speechSynthesis.speak(utterance);
}

botClient.service('Socket', ['$timeout',
  function ($timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      // if (Authentication.user) {
      //   this.socket = io();
      // }
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

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};
