(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['$rootScope', '$scope', 'botUsersResolve','DTOptionsBuilder', '$compile', '$cookies', 'BotUsersService', '$http'];

  function BotUsersListController($rootScope, $scope, botUsers, DTOptionsBuilder, $compile, $cookies, BotUsersService, $http) {
    var vm = this;
    vm.mode = 'default';
    vm.botUsers = botUsers;
    console.log(vm.botUsers)
    console.log($cookies.get('default_bot'))

    $scope.botId = $cookies.get('default_bot') || 'athena';

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-default" ng-click="vm.modeChangeLiveChat()"><i class="fa fa-plus"></i> LiveChat</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        });

    vm.dtOptions2 = DTOptionsBuilder.newOptions()
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $("div.toolbar").html('<button id="addToTable" class="btn btn-default" ng-click="vm.modeChange()"><i class="fa fa-plus"></i> 대화내역</button>');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
      });

    vm.modeChange = function () {
      vm.mode = 'default'
    };

    vm.modeChangeLiveChat = function () {
      $http.post('/api/user-dialogs/liveChat', {botId: $scope.botId}).then(function (result) {
        vm.mode = 'liveChat';
        vm.liveChatUsers = result.data
      }, function (err) {
        console.log(err)
      })
    }

  }
})();
