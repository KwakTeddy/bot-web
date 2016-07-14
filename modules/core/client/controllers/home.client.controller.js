'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Socket',
  function ($scope, Authentication, Socket) {
    var vm = this;

    // if (!Socket.socket) {
    //   Socket.connect();
    // }

    $scope.authentication = Authentication;

    // TODO: Get Server, Bot List
    vm.servers = ['localhost:1024'];
    vm.bots = ['MONEYBOT'];

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

    vm.sendMsg = function () {
      if(!vm.isConnected) {
        return;
      }

      if (vm.msg == ':초기화') {
        init();
        return false;
      }

      addUserBubble(vm.msg);
      emitMsg(vm.msg);
      vm.msg = '';
    };

    function init() {
      clearBubble();
      addBotBubble('머니봇 [' + vm.bot + '] 접속 (' + vm.server.split(':')[0] + ':' + vm.server.split(':')[1] + ' as ' + vm.userId + ')');
      emitMsg(':reset user');
    }

    Socket.on('send_msg', function (message) {
      console.log('out:' + message);
      addBotBubble(message);
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
