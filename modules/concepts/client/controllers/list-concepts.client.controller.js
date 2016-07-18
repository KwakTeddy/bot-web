(function () {
  'use strict';

  angular
    .module('concepts')
    .controller('ConceptsListController', ConceptsListController);

  ConceptsListController.$inject = ['conceptsResolve'];

  function ConceptsListController(concepts) {
    var vm = this;

    vm.concepts = concepts;
  }
})();
