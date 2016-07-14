(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['BotUsersService'];

  function BotUsersListController(BotUsersService) {
    var vm = this;

    vm.botUsers = BotUsersService.query();
  }
})();
