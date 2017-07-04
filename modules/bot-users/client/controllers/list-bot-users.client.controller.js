(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['$rootScope', '$scope', 'botUsersResolve','DTOptionsBuilder', '$compile', '$cookies', 'BotUsersService'];

  function BotUsersListController($rootScope, $scope, botUsers, DTOptionsBuilder, $compile, $cookies, BotUsersService) {
    var vm = this;
    vm.mode = 'default';
    vm.botUsers = botUsers;
    console.log($cookies.get('default_bot'))

    $scope.botId = $cookies.get('default_bot') || 'athena';

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        });

    vm.liveChat = function () {
      vm.mode = 'liveChat';
      BotUsersService.query({botId: $cookies.get('default_bot'), liveChat: true}, function (result) {
        console.log(result);
        vm.liveChatUsers =result
      }, function (err) {
        console.log(err)
      })
    }

  }
})();
