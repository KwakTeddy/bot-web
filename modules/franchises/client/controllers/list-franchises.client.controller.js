(function () {
  'use strict';

  angular
    .module('franchises')
    .controller('FranchisesListController', FranchisesListController);

  FranchisesListController.$inject = ['franchisesResolve'];

  function FranchisesListController(franchises) {
    var vm = this;

    vm.franchises = franchises;
  }
})();
