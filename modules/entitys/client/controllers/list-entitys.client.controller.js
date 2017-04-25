(function () {
  'use strict';

  angular
    .module('entitys')
    .controller('EntitysListController', EntitysListController);

  EntitysListController.$inject = ['entitysResolve'];

  function EntitysListController(entitys) {
    var vm = this;

    vm.entitys = entitys;
  }
})();
