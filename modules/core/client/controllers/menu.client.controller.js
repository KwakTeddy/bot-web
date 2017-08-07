'use strict';

angular.module('core').controller('MenuController', ['$scope', '$state', 'Authentication', 'Menus', '$cookies', '$http', '$rootScope', 'Socket', '$location', '$window', 'BotsService', '$compile',
  function ($scope, $state, Authentication, Menus, $cookies, $http, $rootScope, Socket, $location, $window, BotsService, $compile) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentBot;
    $scope.listContents = [];
    if($scope.authentication && $scope.authentication.user){
      $http.get('/api/bots/byNameId/' + $cookies.get('default_bot')).then(function (result) {
        $scope.currentBot = result.data;
        $http.get('/api/templates/' + result.data.templateId).then(function (result2) {
          var templateSchema = JSON.parse(result2.data.dataSchema);
          var keys = Object.keys(templateSchema);
          var html = '' +
            '<li>' +
            '<a href="#" ng-click="goTemplateBasicContent()">' +
            '<i class="fa fa-cube" aria-hidden="true"></i>' +
            '<span>' + '기본정보' + '</span>' +
            '</a>' +
            '</li>';
          angular.element('#contentsManagement').append(html);
          keys.forEach(function (key) {
            if(templateSchema[key].schema && !templateSchema[key].hidden){
              var element = '' +
                '<li>' +
                '<a href="#" ng-click="goTemplateListContent(\'' + key + '\')">' +
                '<i class="fa fa-cube" aria-hidden="true"></i>' +
                '<span>' + templateSchema[key].item_title + '</span>' +
                '</a>' +
                '</li>';
              angular.element('#contentsManagement').append(element);
            }
          });
          $compile(angular.element('#contentsManagement').contents())($scope);
        }, function (err1) {
          console.log(err1)
        });
      }, function (err) {
        console.log(err);
      });
    }

    $scope.goTemplateListContent = function (kind) {
      $state.go('template-datas.list', {
        templateId: $scope.currentBot.templateId,
        listName: kind,
        upTemplateId: $scope.currentBot.templateDataId
      });
    };

    $scope.goTemplateBasicContent = function (kind) {
      console.log($scope.currentBot)
      $state.go('template-datas.edit', {
        templateId: $scope.currentBot.templateId,
        listName: 'null',
        upTemplateId: $scope.currentBot.templateDataId,
        templateDataId: $scope.currentBot.templateDataId
      });
    };

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
