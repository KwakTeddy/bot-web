(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .controller('UserDialogsListController', UserDialogsListController);

  UserDialogsListController.$inject = ['userDialogsResolve'];

  function UserDialogsListController(userDialogs) {
    var vm = this;
    console.log(userDialogs);

    vm.userDialogs = userDialogs;
  }
})();

