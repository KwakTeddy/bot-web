'use strict';

angular.module('user-bots').controller('UserBotChatController', ['$state', '$rootScope', '$scope', '$stateParams', '$document', '$timeout', '$window', '$compile', '$resource', '$cookies', 'Socket',
  'UserBotsService',
  function ($state, $rootScope, $scope, $stateParams, $document, $timeout, $window, $compile, $resource, $cookies, Socket, UserBotsService) {
    var vm = this;
    $scope.vm = vm;

    // if (!Socket.socket) {
    //   Socket.connect();
    // }

//    $scope.authentication = Authentication;

    vm.server = 'localhost:1024';
    vm.bot = 'athena';
    // vm.userBot = {};
    vm.userBot = UserBotsService.get({userBotId: ($stateParams.userBotId || '58a33a58dd6b0db01f496a36')}, function(userBot) {
      if(userBot.id) vm.bot = userBot.id;
      vm.connect();
    });
    vm.userId = '';
    vm.msg = '';
    vm.isConnected = false;
    vm.isVoice = false;
    var main = document.getElementById('chat_main');

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

    Socket.on('send_msg', function (message) {
      // console.log('out:' + message);

      // if(message.startsWith(':log') && !$state.is('home')) return;

      if(message.startsWith(':log')) {
        if(!$state.is('home')) return;
        vm.log += message.substring(message.indexOf('\n')+1);
        logScrollBottom();
        return;
      }

      // var idx = message.indexOf('url: ');
      // var url;
      // if(idx != -1) {
      //   url = message.substring(idx + 5, message.length);
      //   message = message.substring(0, idx );
      //
      //   console.log('url:' + url);
      //   document.getElementById('webframe').src = url;
      // }

      try {
        message = JSON.parse(message);
      } catch(e) {}

      if(message.smartReply) addButtons(message.smartReply);

      if(message.items) addItems(message.items);
      else addBotBubble(message);

      if(vm.isVoice) {
        var voice = message.voice || message.text || message;
        voice += ',';

        if(message.items) {
          for(var i in message.items) {
            var item = message.items[i];
            if(i == 0) voice += '첫번째 , ';
            else voice += '다음 , ';
            voice += item.title + ',';
          }

          voice += '여기까지 입니다.'
        }

        synthesize(voice);
      }

      // var snd = new Audio('/images/doorbell-6.mp3');
      // snd.play();
    });

    vm.sendMsg = function (msg) {
      if (!vm.isConnected) return false;

      var element = document.getElementById("smart_reply");
      if(element) {
        element.parentNode.removeChild(element);
        main.style.padding = '10px 0px 0px 0px';
      }

      var useInput = false;
      if(!msg || msg.length <= 0) { msg = vm.msg; useInput = true;}
      if(!msg || msg.length <= 0) return false;

      var matched = msg.match(/불러/g);
      if(matched != null) {

        UserBotsService.query({}, function(userBots) {
          console.log(userBots);
          
          var _userBot;
          if(msg.search(/박\s*근\s*혜/) != -1) _userBot = userBots[4];
          else if(msg.indexOf('여자친구') != -1) _userBot = userBots[6];
          else if(msg.indexOf('아테나') != -1) _userBot = userBots[7];
          else if(msg.indexOf('배달') != -1) _userBot = userBots[2];
          else if(msg.indexOf('레스토랑') != -1) _userBot = userBots[3];
          else if(msg.indexOf('센터') != -1) _userBot = userBots[1];

          if(_userBot) {
            vm.bot = _userBot.id;
            vm.userBot = _userBot;
            document.getElementById("chat-header").innerText = vm.bot;
            vm.connect();
          } else {
            addBotBubble('그런 봇을 찾을 수 없습니다.');
            if(vm.isVoice) synthesize('그런 봇을 찾을 수 없습니다.');
          }
        });


        return false;
      }

      if(msg == ':build') { build(); return false;}
      if (msg == ':init') { init(); return false; }

      addUserBubble(msg);
      emitMsg(msg);

      if(useInput)  vm.msg = '';

      return false;
    };

    vm.buildBot = function () {
      vm.sendMsg(':build');
    };

    vm.resetBot = function () {
      vm.sendMsg(':init');
    };

    // 전체화면 이벤트로 전환
    $document.bind("keydown", function(event) {
      $rootScope.$broadcast('keyinput', vm.msg);

      if(event.keyCode == 116) {    // F5
          vm.buildBot();
        } else if(event.keyCode == 27) {
          vm.resetBot();
        }
    });

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

    vm.init = init;

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

    /*********************** voice **********************************/
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

        if(!vm.isVoice) {
          recognition.stop();
          return;
        }
        document.getElementById('inputbox').value = interim_transcript;

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

      start_timestamp = event.timeStamp;

    }

    vm.toggleVoice = function() {
      if(vm.isVoice) {
        vm.isVoice = false;
        ignore_onend = true;
        recognition.stop();

        document.getElementById('inputbox').placeholder = '대화를 입력해 주세요.';
        document.getElementById('voiceButton').style.fontWeight = '300';
        document.getElementById('voiceButton').style.color = '#777';
      } else {
        vm.isVoice = true;

        document.getElementById('inputbox').placeholder = '음성으로 말씀해 주세요.';
        document.getElementById('voiceButton').style.fontWeight = '600';
        document.getElementById('voiceButton').style.color = '#0088cc';
        recognizeStart();
      }
    };

    // END speech recognition

    if($cookies.get('userId') == undefined) {
      vm.userId = generateUUID();
      $cookies.put('userId', vm.userId);
      $rootScope.userId = vm.userId;
    } else {
      vm.userId = $cookies.get('userId');
      $rootScope.userId = vm.userId;
    }

    // if(vm.bot) vm.connect();
    angular.element('#inputbox').focus();

    if(_platform != 'mobile')
      document.getElementById("chat-header").innerText = vm.bot;

    $scope.$on('setUserBot', function(event, arg0) {
      var userBot = arg0;
      vm.bot = userBot.id;
      vm.userBot = userBot;
      document.getElementById("chat-header").innerText = vm.bot;
      vm.connect();
    });

    /*********************** 채팅 UI ***********************/
    var logScrollTimer = -1;
    function logScrollBottom() {
      // if(logScrollTimer > -1) clearTimeout(logScrollTimer);

      // logScrollTimer = setTimeout(function() {
      var logDiv = document.getElementById('logDiv');
      logDiv.scrollTop = logDiv.scrollHeight - logDiv.clientHeight;
      // logScrollTimer = -1;
      // }, 300);
    }

    function clearBubble() {
      var main = document.getElementById('chat_main');
      main.innerText = '';
      document.chatForm.inputbox.value = '';
    }

    function addBotBubble(msg) {
      var text = (msg && msg.text) ? msg.text : msg;

      var d = new Date();
      var datetext = d.getHours() + ':' + d.getMinutes();
      var innerHTML =
        '<div class="item item-avatar b-none friend">'+
        '<img src="'+vm.userBot.imageFile+'">' +
        '<div class="text-xs"><span class="font-bold m-r-sm">'+vm.userBot.name+'</span><span class="color-grey-500">'+datetext+'</span></div>' +
        '<div class="bubble"><i class="icon-tail"></i>' +
        '<div class="content"><div class="content-text">' + text + '</div>';

        if(msg.buttons) {
          for(var i in msg.buttons) {
            innerHTML += '<div class="bubble-button"><a href="' + msg.buttons[i].url + '" target="_blank">' + msg.buttons[i].text + '</a></div>';
          }
        }

        innerHTML += '</div></div>';

      innerHTML += '</div>';

      var main = document.getElementById('chat_main');
      main.insertAdjacentHTML('beforeend', innerHTML);

      main.scrollTop = main.scrollHeight - main.clientHeight;
    }

    function addButtons(replies) {
      if(replies == undefined) return;

      var innerHTML = '';
      innerHTML = '<div id="smart_reply" class="smart_reply owl-carousel owl-theme" >';

      for(var i in replies) {
        innerHTML += '<div class="item">' +
        '<button ng-click="vm.sendMsg(\'' + replies[i] + '\')" style="width: auto;" >' + replies[i] + '</button>' +
        '</div>';
      }

      innerHTML += '</div>';

      var main = document.getElementById('chat_main');
      main.style.padding = '10px 0px 30px 0px';

      main.insertAdjacentHTML('beforeend', innerHTML);

      var replies = document.getElementById('smart_reply').childNodes;
      for(var i in replies) {
        var child = replies[i].firstChild;
        if(child && child.style) child.style.width = (child.offsetWidth + 5 ) + 'px';
      }

      $('.smart_reply').owlCarousel({
        loop:false,
        nav:false,
        dots: false,
        margin: 3,
        autoWidth: true
      });

      var element = angular.element(document.querySelector('#smart_reply'));
      $compile(element.contents())($scope);
    }

    function addItems(items) {
      var innerHTML =
      '<div class="chat-items owl-carousel owl-theme" style="clear: both">';

      for(var i in items) {
        innerHTML += '<div class="item" >' +
        '<div class="thumbnail">';
        if(items[i].imageUrl) innerHTML += '<img src="' + items[i].imageUrl + '" >';
        innerHTML += '<div class="caption">';
        if(items[i].title) innerHTML += '<h3>' + items[i].title + '</h3>';
        if(items[i].text) innerHTML += '<p>' + items[i].text + '</p>';
        innerHTML += '</div>';

        if(items[i].buttons) {
          for(var j in items[i].buttons) {
            innerHTML += '<div class="chat-item-button"><a href="' + items[i].buttons[j].url + '" target="_blank">' + items[i].buttons[j].text + '</a></div>';
          }
        }

        innerHTML += '</div></div>';
      }

      innerHTML += '</div>';

      main.insertAdjacentHTML('beforeend', innerHTML);

      $('.chat-items').owlCarousel({
        loop:false,
        nav:false,
        margin: 0,
        items: 2
      });

      main.scrollTop = main.scrollHeight - main.clientHeight;
    }

    function addUserBubble(msg) {
      var main = document.getElementById('chat_main');

      var d = new Date();
      var datetext = d.getHours() + ':' + d.getMinutes();

      if(true /*_platform == 'mobile'*/) {
        var bubble = document.createElement('div');
        bubble.setAttribute('class', 'item item-avatar-right b-none me');
        bubble.innerHTML =
          '<div class="text-xs"><span class="font-bold m-r-sm"></span><span class="color-grey-500">'+ datetext + '</span></div>' +
          '<div class="bubble"><i class="icon-tail-me"></i><span class="content">' + msg + '</span></div>';

        main.appendChild(bubble);
      } else {
        var bubble = document.createElement('div');
        bubble.setAttribute('class', 'bubble bubble--alt');
        bubble.innerText = msg;
        main.appendChild(bubble);
      }

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

    function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }

    if(vm.isVoice) recognizeStart();

    // recognition.stop();
    // synthesize('안녕하세요');
  }
]);

