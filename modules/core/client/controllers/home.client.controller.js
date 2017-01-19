'use strict';

angular.module('core').controller('HomeController', ['$scope', '$document', '$cookies', 'Authentication', 'Socket',
  function ($scope, $document, $cookies, Authentication, Socket) {
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

      $cookies.put('default_bot', vm.bot);

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

      addUserBubble(vm.msg);
      emitMsg(vm.msg);

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
        addBotBubble('머니봇 [' + vm.bot + '] 접속 (' + vm.server.split(':')[0] + ':' + vm.server.split(':')[1] + ' as ' + vm.userId + ')');
        emitMsg(':build ' + vm.bot + ' reset');
      }

      function init() {
        vm.log = '';

        clearBubble();
        addBotBubble('머니봇 [' + vm.bot + '] 접속 (' + vm.server.split(':')[0] + ':' + vm.server.split(':')[1] + ' as ' + vm.userId + ')');
        emitMsg(':reset user');

        setTimeout(function() {
          console.log('init: ' + vm.initMsg);
          if(vm.initMsg != undefined && vm.initMsg != null && vm.initMsg != '') emitMsg(vm.initMsg);
        }, 200);
      }

      Socket.on('send_msg', function (message) {
        console.log('out:' + message);

        if(message.startsWith(':log')) {
          vm.log += message.substring(message.indexOf('\n')+1);
          logScrollBottom();
        } else addBotBubble(message);
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

    vm.log = '';

    vm.bot = $cookies.get('default_bot');
    vm.userId = 'com2best';
    vm.connect();

    angular.element('#inputbox').focus();
  }
]);

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
