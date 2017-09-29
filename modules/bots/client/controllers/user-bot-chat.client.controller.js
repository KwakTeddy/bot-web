'use strict';

angular.module('user-bots').controller('UserBotChatController', ['$state', '$rootScope', '$scope', '$stateParams', '$document', '$location', '$compile', '$resource', '$cookies', 'Socket', '$uibModal', 'Authentication',
  'UserBotsService', '$ionicModal', '$ionicScrollDelegate', '$http', '$window',
  function ($state, $rootScope, $scope, $stateParams, $document, $location, $compile, $resource, $cookies, Socket, $uibModal, Authentication,
            UserBotsService, $ionicModal, $ionicScrollDelegate, $http, $window) {
    // if (!Socket.socket) {
    //   Socket.connect();
    // }
    var vm = this;
    var sendedMsg = '';
    var main = document.getElementById('chat_main');

    $scope.vm = vm;
    vm.authentication = Authentication;
    vm.$stateParams = $stateParams;
    vm.params = $location.search();
    vm.server = 'localhost:1024';
    vm.bot = $stateParams.userBotId || $cookies.get('default_bot') || 'athena';
    vm.userBot = {};
    // vm.userBot = UserBotsService.get({userBotId: ($stateParams.userBotId || '58a33a58dd6b0db01f496a36')}, function(userBot) {
    //   if(userBot.id) vm.bot = userBot.id;
    //   vm.connect();
    // });
    vm.userId = '';
    vm.msg = '';
    vm.isConnected = false;
    vm.isVoice = false;
    vm.stt = false;
    vm.tts = false;

    vm.openChatModal = function (botId) {
      vm.connectUserBot(botId);
      vm.sendMsg('시작');
      vm.modalInstance = $uibModal.open({
        templateUrl: 'modules/bots/client/views/bot-graph-knowledge.client.view.html',
        scope: $scope
      });
      $scope.closeGraph = function () {
        vm.modalInstance.dismiss();
      };
    };

    vm.connect = function () {
      if (!vm.userId || vm.userId.length <= 0) {
        alert('유저명을 입력해주세요!');
        return;
      }

      if (!Socket.socket) {
        Socket.connect();
      }
      $cookies.put('default_bot', vm.bot);
      // $http.get('/api/bots/byNameId/'+vm.bot).then(function (result) {
      //   console.log(result);
      //   $cookies.put('botObjectId', result.data._id)
      // }, function (err) {
      //   console.log(err)
      // });

      vm.isConnected = true;
      init();
    };

    Socket.on('send_msg', function (message) {
      // console.log('out:' + message);

      // if(message.startsWith(':log') && !$state.is('home')) return;
      //   console.log(message.lastIndexOf(':log'));

            $rootScope.graphUpdate();

      if(message.lastIndexOf(':log') == 0) {
        // if(!$state.is('developer-home') && !$state.is('user-bots.context-analytics') &&
        //   !$state.is('bots.graph-knowledge') && !$state.is('bots.graph-dialog') &&
        //   !$state.is('bots.dialog-tree')) return;

        // vm.log += message.substring(message.indexOf('\n')+1);
        // logScrollBottom()

        $rootScope.logUpdated = message.substring(message.indexOf('\n')+1);
        $rootScope.$broadcast('updateLog');

        return;
      }

      try {
        message = JSON.parse(message);
      } catch(e) {
        // console.log(e);
      }

      if(message.bot != undefined) {
        vm.changeBotInfo(message.bot);
      }

      if(message.smartReply) addButtons(message.smartReply);

      if(message.actions) execActions(message.actions);
      else if(vm.isVoice) recognizeStart();

      if(message.items) addItems(message.items);
      else addBotBubble(message);

      if(vm.tts) {
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

        //synthesize(voice);
        speak(voice);
      }
      $rootScope.$broadcast('onmsg', {message: message});
      $rootScope.$broadcast('sendmsg', {message: sendedMsg});

      // var snd = new Audio('/images/doorbell-6.mp3');
      // snd.play();
    });

    vm.mobileModal = function () {
      $ionicModal.fromTemplateUrl('my-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
      });
      // $scope.openModal = function() {
      //     $scope.modal.show();
      // };
      $scope.closeModal = function() {
          $scope.modal.hide();
      };
      $scope.userBotLearn = function () {
          $scope.modal.hide();
          $state.go('user-bots.edit', {userBotId: vm.userBot._id})
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
          $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
          // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
          // Execute action
      });
    };

    vm.fbShare = function () {
        $scope.location = location.href;
        FB.ui({
            method: 'share',
            display: 'popup',
            href: $scope.location,
            title: vm.userBot.name,
            description: vm.userBot.description,
            picture: location.protocol+'//'+location.hostname+'/'+ vm.userBot.imageFile,
        }, function(response){
            // console.log(response);
        });
    };

    vm.kakaoShare = function () {
        $scope.location = location.href;
        // console.log(vm.userBot.description);
        Kakao.Story.share({
            url: $scope.location,
            text: vm.userBot.name+'-'+ vm.userBot.description
        });
    };

    vm.kakaoTalkShare = function () {
      $scope.location = location.href;
      Kakao.Link.sendTalkLink({
          label: vm.userBot.name+'-'+ vm.userBot.description,
          image: {src: location.protocol+'//'+location.hostname+'/'+ vm.userBot.imageFile, width:90, height:90 },
          webButton: {text : "플레이 챗으로 가요", url: $scope.location},
      });
    };

    vm.twitterShare = function () {
        $scope.location = location.href;
        window.open('https://twitter.com/intent/tweet?text='+ vm.userBot.name+'-'+ vm.userBot.description + '&url=' + $scope.location, 'popup', 'width=600, height=400')
    };

    var textTimer = null;
    var showText = function (target, message, index, interval) {
      if (index < message.length) {
        var char = message[index++];
        if (char == '\n') char = "<br>";
        $(target).append(char);
        textTimer = setTimeout(function () {
          showText(target, message, index, interval);
        }, interval);
      } else {
        textTimer = null;
      }
    };

    if ($window.location.href.indexOf('developer') == -1){
      $scope.$on('onmsg', function(event, arg0) {
        if (arg0.message.items) {
          vm.isAnswer = false;
          addItems(arg0.message.items);
          return;
        }

        if(arg0.message.smartReply) {
          vm.isAnswer = true;
          addButtons(arg0.message.smartReply);
        }

        if (arg0.message.image) {
          vm.isAnswer = false;

          var msg = arg0.message;
          var innerHTML = '<div class="content" style="><div class="content-text">' + msg.text + '</div>';
          innerHTML += '<div><img class="message-image" width="35%" height="35%" src="' + msg.image.url +'"/></div>';
          if(msg.buttons) {
            for(var i in msg.buttons) {
              innerHTML += '<div class="bubble-button" style="border-top:none"><a href="' + msg.buttons[i].url + '" target="_blank">' + msg.buttons[i].text + '</a></div>';
            }
          }
          innerHTML += '</div></div>';
          main.insertAdjacentHTML("afterbegin",innerHTML);

          return;
        }

        vm.isAnswer = true;
        var input='';
        if (typeof arg0.message === 'string') input = arg0.message;
        else input = arg0.message.text;

        $('#answer').text('');
        if (textTimer != null)
          clearTimeout(textTimer);
        var interval = 40;
        showText('#answer', input, 0, interval);
      });
    }

    $scope.$on('sendMsgFromFarAway', function(event, arg0) {
      vm.sendMsg(arg0);
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

      if(msg == ':build') { build(); return false;}
      if(msg == ':init') { init(); return false; }
      if(msg.lastIndexOf(':connect') == 0) {
        var args = msg.split(/\s/);
        if(args.length > 1) vm.connectUserBot(args[1]);
        return false;
      }
      vm.question = '';
      addUserBubble(msg);
      emitMsg(msg);

      // $rootScope.$broadcast('sendmsg', {message: msg});
      sendedMsg = vm.msg;
      if(useInput)  vm.msg = '';

      return false;
    };

    vm.buildBot = function () {
      vm.sendMsg(':build');
    };

    vm.resetBot = function () {
      vm.sendMsg(':init');
    };

    vm.changeBotInfo = function(userBot) {
      vm.bot = userBot.id;
      $cookies.put('default_bot', vm.bot);

      vm.userBot = userBot;
      $rootScope.botId = userBot.id;
      $rootScope.botObjectId = userBot._id;
      $cookies.put('botObjectId', userBot._id);
      $rootScope.userBot = vm.userBot;

      var header = document.getElementById("chat-header");
      if(header) header.innerText = userBot.name;
    };

    vm.connectUserBot = function(botId) {
      clearBubble();
      $resource('/api/bots/byNameId/:botNameId', {botNameId:'@id'}).
      get({botNameId: botId}, function(data) {
        vm.changeBotInfo(data);
        vm.connect();
      }, function(err) {
        vm.changeBotInfo({id: vm.bot, name: vm.bot});
        vm.connect();
      });
    };

    vm.disableEvent = false;
    var keydown = function(event) {
      if (!vm.disableEvent)
        $rootScope.$broadcast('keyinput', vm.msg);

      // only in developer
      // if ($state.is('developer-home') || $state.current.name.startsWith('bots.')) {
        if (event.keyCode == 118) {         // F7
          vm.buildBot();
          angular.element('#inputbox').focus();
          event.preventDefault();
        } else if (event.keyCode == 116) {  //F5
          vm.resetBot();
          angular.element('#inputbox').focus();
          event.preventDefault();
        } else if (event.keyCode == 121) {  //F10
          angular.element('#inputbox').focus();
          event.preventDefault();
        }
      // }
    };

    $document.bind("keydown", keydown);

    $scope.$on("stopKeyDown", function (event) {
      vm.disableEvent = true;
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

      $rootScope.$broadcast('getInitMsg');

      setTimeout(function() {
        if($rootScope.initMsg != undefined && $rootScope.initMsg != null && $rootScope.initMsg != '') emitMsg($rootScope.initMsg);
      }, 200);

    }

    vm.init = init;

    function emitMsg(msg) {
      if(vm.params) vm.params.dev = true;
      else vm.params = {dev: true};

      Socket.emit('send_msg', {
        bot: vm.bot,
        user: vm.userId,
        msg: msg,
        options: vm.params
      });
    }

    $scope.$on('$destroy', function () {
      Socket.removeListener('send_msg');
    });

    vm.connectUserBot(vm.bot);

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
        console.log('recognition.onstart');
      };

      recognition.onerror = function(event) {
        console.log('recognition.onerror' + event.error);

        if (event.error == 'no-speech') {
          // console.log('info_no_speech');
          ignore_onend = true;
        } else if (event.error == 'audio-capture') {
          // console.log('info_no_microphone');
          ignore_onend = true;
        } else if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            // console.log('info_blocked');
          } else {
            // console.log('info_denied');
          }
          ignore_onend = true;
        } else ignore_onend = true;
      };

      recognition.onend = function() {
        console.log('recognition.onend');

        if(recognizing) recognizeStart();
        recognizing = false;
        if (ignore_onend) return;


        if (!final_transcript) {
          // console.log('info_start');
          return;
        }
        console.log('recognition.onend: ' + final_transcript);

        // recognizeStart();

        // vm.sendMsg(final_transcript);
      };

      recognition.onresult = function(event) {
        console.log('recognition.onresult');

        if (ignore_onend) return;

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
          recognizeStop();
          return;
        }
        document.getElementById('inputbox').value = interim_transcript;

        final_transcript = interim_transcript;

        if (final_transcript || interim_transcript) {
          console.log('transcript:' + interim_transcript);
        }

        if(isFinal) {
          console.log('isFinal:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
          if(timeoutFinish) {
            finalFinish = false; timeoutFinish = false;
            return;
          }
          finalFinish = true;
          console.log('isFinal:' + interim_transcript);
          recognizeStop();
          vm.sendMsg(interim_transcript);
        } else {

          if(regcognitionTimer) clearTimeout(regcognitionTimer);
          regcognitionTimer = setTimeout(function() {
            console.log('timeout:' + 'final('+finalFinish + '),timeout(' + timeoutFinish + ')');
            if(finalFinish) {
              finalFinish = false; timeoutFinish = false;
              return;
            } else if(timeoutFinish) return;

            timeoutFinish = true;
            console.log('timeout: ' + interim_transcript);
            if(interim_transcript != undefined && interim_transcript != '') {
              ignore_onend = true;
              recognizeStop();
              vm.sendMsg(final_transcript);
            }
          }, 2000);
        }
      };
    }

    function recognizeStop() {
      console.log('recognizeStop');

      recognizing = false;
      if (recognition != undefined) recognition.stop();
    }

    function recognizeStart() {
      console.log('recognizeStart');
      if (recognizing && recognition != undefined) {
        recognition.stop();
        return;
      }

      recognition.lang = 'ko-KR';
      console.log(recognition);
      console.log(recognition.start());
      recognition.start();

      final_transcript = '';
      ignore_onend = false;
      finalFinish = false;
      timeoutFinish = false;
      recognizing = true;

      // start_timestamp = event.timeStamp;
    }

    vm.toggleVoice = function() {
      if(vm.isVoice) {
        vm.isVoice = false;
        ignore_onend = true;
        recognizeStop();

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
    //if(_platform == 'web') angular.element('#inputbox').focus();

    if(_platform != 'mobile')
      document.getElementById("chat-header").innerText = vm.bot;

    $scope.$on('resetUserBot', function(event, arg0) {
      var userBot = arg0;
      vm.bot = userBot.id;
      vm.userBot = userBot;
      vm.connectUserBot(vm.bot);
    });

    $scope.$on('setUserBot', function(event, arg0) {
      var userBot = arg0;
      if (vm.bot !== userBot.id) {
        vm.bot = userBot.id;
        vm.userBot = userBot;
        vm.connectUserBot(vm.bot);
      }
    });

    $scope.$on('setUserBotAlways', function(event, arg0) {
      var userBot = arg0;
      vm.bot = userBot.id;
      vm.userBot = userBot;
      vm.connectUserBot(vm.bot);
    });

    $scope.$on('connectUserBot', function(event, arg0) {
      vm.connectUserBot(arg0.id);
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
      // var text = (msg != undefined && msg.text != undefined) ? msg.text : msg;
      var text;
      if(msg != undefined && msg.text != undefined)
        text = msg.text;
      else
        text = msg;

      var d = new Date();
      var datetext = d.getHours() + ':' + d.getMinutes();
      var innerHTML =
        '<div class="item item-avatar b-none friend" id="i'+d.getTime()+'">'+
        '<img src="'+(vm.userBot.imageFile? vm.userBot.imageFile: '/images/!logged-user.jpg')+'">' +
        '<div class="text-xs"><span class="font-bold m-r-sm">'+vm.userBot.name+'</span><span class="color-grey-500">'+datetext+'</span></div>' +
        '<div class="bubble"><i class="icon-tail"></i>' +
        '<div class="content"><div class="content-text">' + text + '</div>';

      if(msg.image) {
        innerHTML += '<div ><img class="message-image" src="' + msg.image.url +'"/></div>';
      }

      if(msg.buttons) {
        for(var i in msg.buttons) {
          if(msg.buttons[i].url) innerHTML += '<div class="bubble-button"><a href="' + msg.buttons[i].url + '" target="_blank">' + msg.buttons[i].text + '</a></div>';
          else innerHTML += '<div class="bubble-button"><a ng-click="vm.sendMsg(\'' + msg.buttons[i].text + '\')">' + msg.buttons[i].text + '</a></div>';
        }
      }

      innerHTML += '</div></div>';

      innerHTML += '</div>';

      var main = document.getElementById('chat_main');
      main.insertAdjacentHTML('beforeend', innerHTML);

      var element = angular.element(document.querySelector('#i' +d.getTime()));
      $compile(element.contents())($scope);

      if(_platform == 'mobile') $ionicScrollDelegate.scrollBottom();
      else main.scrollTop = main.scrollHeight - main.clientHeight;
    }

    function addButtons(replies) {
      console.log(replies);
      if(replies == undefined) return;


      var innerHTML = '';
      innerHTML = '<div id="smart_reply" class="smart_reply owl-carousel owl-theme" >';

      for(var i in replies) {
        innerHTML += '<div class="item">' +
        '<button ng-click="vm.sendMsg(\'' + replies[i] + '\')" style="width: auto;" >' + replies[i] + '</button>' +
        '</div>';
      }

      innerHTML += '</div>';

      if ($window.location.href.indexOf('developer') == -1){
        // main = document.getElementById('chat_main');
        // $('#buttons').append(innerHTML);
        // $('#buttons').css('padding', '10px 0px 30px 0px');
        // // buttons.style.padding = '10px 0px 30px 0px';
        // // buttons.insertAdjacentHTML('beforeend', innerHTML);
        // var replies = $('#smart_reply').childNodes;
        // console.log(replies);
        // for(var i in replies) {
        //   var child = replies[i].firstChild;
        //   if(child && child.style) child.style.width = (child.offsetWidth + 5 ) + 'px';
        // }
        //
        // var element = angular.element('#smart_reply');
        // $compile(element.contents())($scope);
        //
        // console.log($('.smart_reply'));
        // $('.smart_reply').owlCarousel({
        //   loop:false,
        //   nav:false,
        //   dots: false,
        //   items: 4,
        //   margin: 3,
        //   autoWidth: true
        // });
      }else {
        var main;

        if(_platform == 'mobile') {
          main = document.getElementsByTagName('ion-content')[0];
        } else {
          main = document.getElementById('chat_main');
          main.style.padding = '10px 0px 30px 0px';

          // reset owl
          while (main.hasChildNodes()) {
            main.removeChild(main.firstChild);
          }
        }
        main.insertAdjacentHTML('beforeend', innerHTML);
        var replies = document.getElementById('smart_reply').childNodes;
        for(var i in replies) {
          var child = replies[i].firstChild;
          if(child && child.style) child.style.width = (child.offsetWidth + 5 ) + 'px';
        }

        var element = angular.element(document.querySelector('#smart_reply'));
        $compile(element.contents())($scope);
        console.log($('.smart_reply'))
        $('.smart_reply').owlCarousel({
          loop:false,
          nav:false,
          dots: false,
          items: 4,
          margin: 3,
          autoWidth: true
        });
      }
    }

    var itemsCnt = 0;
    function addItems(items) {
      var innerHTML =
      '<div id="items' + (++itemsCnt) + '" class="chat-items owl-carousel owl-theme" style="clear: both">';

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
            if(items[i].buttons[j].url) {
              innerHTML += '<div class="chat-item-button"><a href="' + items[i].buttons[j].url + '" target="_blank">' + items[i].buttons[j].text + '</a></div>';
            } else {
              innerHTML += '<div class="chat-item-button"><a ng-click="vm.sendMsg(\'' + items[i].buttons[j].text + '\')">' + items[i].buttons[j].text + '</a></div>';
            }
          }
        }

        innerHTML += '</div></div>';
      }

      innerHTML += '</div>';

      main.insertAdjacentHTML('beforeend', innerHTML);

      var element = angular.element(document.querySelector('#items' + itemsCnt));
      $compile(element.contents())($scope);

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
      if(!vm.tts) return;

      recognizeStop();

      var utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ko-KR';
      console.log(JSON.stringify(utterance.getVoices()));
      utterance.onstart = function(event) {
        console.log('synthesize start');
      };
      utterance.onerror = function(event) {
        console.log('synthesize error');
        recognizeStart();
      };
      utterance.onend = function(event) {
        console.log('synthesize end');
        recognizeStart();
      };
      window.speechSynthesis.speak(utterance);
    }

    function speak(message) {
      var snd = new Audio('/api/speech/' + message);
      snd.play();
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

    /********************* 액션 처리 *********************/
    var holoDefaultVideo = 'http://localhost:8443/videos/지속동영상.mp4';
    vm.videoToggle = false;
    vm.videoPlay = false;
    $rootScope.videoToggle = false;

    function execActions(actions) {
      for(var i = 0; i < actions.length; i++) {
        var item = actions[i];
        if(item.action == 'holo-start') {
          recognizeStart();
          playVideo(holoDefaultVideo, true, true, function() {
            console.log('hole start play end');
          });
        } else if(item.action == 'play-video-full') {
          recognizeStop();
          playVideo(item.url, true, false, function() {
            console.log('hole video play end');
            recognizeStart();
            // playVideo(holoDefaultVideo, true, true, function() {
            //   console.log('hole video play end');
            // });
          });
        }
      }
    }

    function playVideo(videoUrl, isFull, isLoop, callback) {

      if(!vm.videoPlay) {
        document.getElementById('videoSection').style.visibility = 'visible';
        vm.videoPlay = true;
      }

      vm.videoToggle = !vm.videoToggle;
      $rootScope.$broadcast('videoToggle', vm.videoToggle);


      setTimeout(function() {
        var playerName;
        if(!vm.videoToggle) playerName = 'videoPlayer2';
        else playerName = 'videoPlayer1';

        var source = document.createElement('source');
        source.setAttribute('src', videoUrl);
        source.setAttribute('type', 'video/mp4');

        var video = document.getElementById(playerName);
        if(video) {
          // if(isFull) video.className = 'video-full';
          // else video.className = 'video-inline';
          // video.muted = true;
          if(isLoop) video.loop = true;
          else video.loop = undefined;
          video.onended = callback;

          if(video.childNodes && video.childNodes.length > 0) {
            video.replaceChild(source, video.childNodes[0]);
          } else video.appendChild(source);
        }
      }, 100);
    }

    // recognition.stop();
    // synthesize('안녕하세요');
  }
]);


function closeChatPanel() {
  var main = document.getElementById('main');
  var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
  main.style.marginRight = (mr - 330) + 'px';

  var chatPanel = document.getElementById('chat-include');
  if(chatPanel) chatPanel.style.display = 'none';

  document.getElementById('chatCloseBtn').style.display = 'none';
  document.getElementById('chatOpenBtn').style.display = 'block';

  document.querySelector('.page-header').style.paddingRight = '0';
}

function openChatPanel() {
  var main = document.getElementById('main');
  var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
  main.style.marginRight = (mr + 330) + 'px';


  var chatPanel = document.getElementById('chat-include');
  if(chatPanel) chatPanel.style.display = 'block';

  document.getElementById('chatOpenBtn').style.display = 'none';
  document.getElementById('chatCloseBtn').style.display = 'block';

  document.querySelector('.page-header').style.paddingRight = '330px';
}
