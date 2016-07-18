(function () {
  'use strict';

  angular
    .module('custom-actions')
    .controller('CustomActionsListController', CustomActionsListController);

  CustomActionsListController.$inject = ['customActionsResolve'];

  function CustomActionsListController(customActions) {
    var vm = this;

    vm.customActions = customActions;
  }
})();
