(function () {
  'use strict';

  angular
    .module('intents')
    .controller('IntentsListController', IntentsListController);

  IntentsListController.$inject = ['intentsResolve'];

  function IntentsListController(intents) {
    var vm = this;

    vm.intents = intents;
  }
})();
