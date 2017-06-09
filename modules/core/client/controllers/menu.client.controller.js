'use strict';

angular.module('core').controller('MenuController', ['$scope', '$state', 'Authentication', 'Menus', '$cookies', '$http', '$rootScope', 'Socket', '$location', '$window', 'BotsService',
  function ($scope, $state, Authentication, Menus, $cookies, $http, $rootScope, Socket, $location, $window, BotsService) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentBot = '';

    // $http.get('/api/bots/byNameId/' + $cookies.get('default_bot')).then(function (result) {
    //   $scope.currentBot = result.data;
    // }, function (err) {
    //   console.log(err);
    // });

    BotsService.query({my: 1}, function (result) {
      if(!result.length){
        $scope.noBot = true;
      }
    }, function (err) {
      console.log(err)
    });

    function emitMsg(msg, target) {
      Socket.emit('send_msg', {
        bot: target.id,
        user: $scope.authentication.user._id,
        msg: msg,
        options: $location.search()
      });
    }

    $scope.connect = function () {
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

    $scope.changeBotInfo = function(userBot) {
      vm.bot = userBot.id;
      $cookies.put('default_bot', vm.bot);

      vm.userBot = userBot;
      $rootScope.botId = userBot.id;
      $rootScope.userBot = vm.userBot;

      var header = document.getElementById("chat-header");
      if(header) header.innerText = userBot.name;
    };

    function clearBubble() {
      var main = document.getElementById('chat_main');
      main.innerText = '';
      document.chatForm.inputbox.value = '';
    }

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
