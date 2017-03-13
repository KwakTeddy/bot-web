(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('dialogsets')
    .controller('DialogsetDialogsController', DialogsetDialogsController);

  DialogsetDialogsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dialogsetResolve', 'dialogsetDialogResolve', 'DialogsetDialogsService'];

  function DialogsetDialogsController($scope, $state, $window, Authentication, dialogset, dialogsetDialogs, DialogsetDialogsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dialogset = dialogset;
    vm.dialogsetDialogs = dialogsetDialogs;
    vm.error = null;

    vm.dialog = new DialogsetDialogsService({user: vm.user, dialogset: vm.dialogset._id});

    vm.createDialog = function() {
      vm.dialog.$save(function (response) {
        vm.dialogsetDialogs.push(response);

        vm.dialog = new DialogsetDialogsService({user: vm.user, dialogset: vm.dialogset._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new DialogsetDialogsService({user: vm.user, dialogset: vm.dialogset._id});
      })
    };

    vm.updateDialog = function (dialog) {
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      dialog.$remove(function(response) {
        console.log(response);
        dialog.deleted = 'true';
      });
    };
  }
})();
