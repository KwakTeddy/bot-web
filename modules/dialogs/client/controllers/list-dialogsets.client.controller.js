(function () {
  'use strict';

  angular
    .module('dialogsets')
    .controller('DialogsetsListController', DialogsetsListController);

  DialogsetsListController.$inject = ['dialogsetsResolve'];

  function DialogsetsListController(dialogsets) {
    var vm = this;

    vm.dialogsets = dialogsets;
  }
})();
