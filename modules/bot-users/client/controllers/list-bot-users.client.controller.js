(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['botUsersResolve'];

  function BotUsersListController(botUsers) {
    var vm = this;

    vm.botUsers = botUsers;
  }
})();
