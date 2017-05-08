(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .controller('UserDialogsListController', UserDialogsListController);

  UserDialogsListController.$inject = ['userDialogsResolve', 'UserDialogsService', '$rootScope', '$stateParams'];

  function UserDialogsListController(userDialogs, UserDialogsService, $rootScope, $stateParams) {
    var vm = this;

    vm.userDialogs = userDialogs;
    console.log(vm.userDialogs);
    vm.onKeyPress = function (keyCode) {
      UserDialogsService.query({botId: $stateParams.botId, userKey: $stateParams.userKey}, function (result) {
        console.log(result);
        vm.userDialogs = result;
      }, function (err) {
        console.log(err);
      });
    }
  }
})();

