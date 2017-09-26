(function () {
  'use strict';

  angular
    .module('facts')
    .controller('FactsListController', FactsListController);

  FactsListController.$inject = ['factsResolve'];

  function FactsListController(facts) {
    var vm = this;

    vm.facts = facts;
  }
})();
