(function () {
  'use strict';

  angular
    .module('banks')
    .controller('BanksListController', BanksListController);

  BanksListController.$inject = ['BanksService'];

  function BanksListController(BanksService) {
    var vm = this;

    vm.banks = BanksService.query();
  }
})();
