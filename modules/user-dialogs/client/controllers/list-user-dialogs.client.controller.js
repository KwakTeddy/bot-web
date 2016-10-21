(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('UserDialogsListController', UserDialogsListController);

  UserDialogsListController.$inject = ['userDialogsResolve'];

  function UserDialogsListController(userDialogs) {
    var vm = this;

    vm.userDialogs = userDialogs;
  }
})();
