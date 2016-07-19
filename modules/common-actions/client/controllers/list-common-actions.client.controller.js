(function () {
  'use strict';

  angular
    .module('common-actions')
    .controller('CommonActionsListController', CommonActionsListController);

  CommonActionsListController.$inject = ['commonActionsResolve'];

  function CommonActionsListController(commonActions) {
    var vm = this;

    vm.commonActions = commonActions;
  }
})();
