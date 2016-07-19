(function () {
  'use strict';

  angular
    .module('canonicals')
    .controller('CanonicalsListController', CanonicalsListController);

  CanonicalsListController.$inject = ['canonicalsResolve'];

  function CanonicalsListController(canonicals) {
    var vm = this;

    vm.canonicals = canonicals;
  }
})();
