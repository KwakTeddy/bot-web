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
    for(var i = 0; i < vm.dialogsetDialogs.length; i++){
      if(vm.dialogsetDialogs[i].parent){
        for(var j = 0; j < vm.dialogsetDialogs.length; j++){
          if(vm.dialogsetDialogs[j]._id == vm.dialogsetDialogs[i].parent){
            vm.dialogsetDialogs.splice(j+1, 0, vm.dialogsetDialogs[i]);
            vm.dialogsetDialogs.splice(i+1, 1)
          }
        }
      }
    }
    vm.error = null;

    vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
    vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
    console.log(vm.dialog);

    vm.createDialog = function() {
      console.log(vm.dialog);
      vm.dialog.$save(function (response) {
        vm.dialogsetDialogs.push(response);

        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      })
    };

    vm.createDepthDialog = function(parent, index) {
      vm.childDialog['parent'] = parent._id;
      vm.childDialog.$save(function (response) {
        vm.childDialog = response;
        vm.dialogsetDialogs.splice(index+1, 0, response);
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
        // vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (err) {
        $scope.error = errorResponse.data.message;
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
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
