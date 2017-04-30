(function () {
  'use strict';

  angular
    .module('dialogsets')
    .controller('DialogsetsListController', DialogsetsListController);

  DialogsetsListController.$inject = ['dialogsetsResolve', '$stateParams'];

  function DialogsetsListController(dialogsets, $stateParams) {
    var vm = this;
    console.log($stateParams);
    vm.listType = $stateParams.listType;
    if($stateParams.listType == 'public'){

    }

    vm.dialogsets = dialogsets;
  }
})();
