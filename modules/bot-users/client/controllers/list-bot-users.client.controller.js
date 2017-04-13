(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['$rootScope', '$scope', 'botUsersResolve'];

  function BotUsersListController($rootScope, $scope, botUsers) {
    var vm = this;

    vm.botUsers = botUsers;

    $scope.botId = $rootScope.botId || 'athena';
  }
})();
