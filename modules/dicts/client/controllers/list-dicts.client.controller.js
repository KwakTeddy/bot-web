(function () {
  'use strict';

  angular
    .module('dicts')
    .controller('DictsListController', DictsListController);

  DictsListController.$inject = ['dictsResolve'];

  function DictsListController(dicts) {
    var vm = this;

    vm.dicts = dicts;
  }
})();
