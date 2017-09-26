(function () {
  'use strict';

  angular
    .module('menu-navigations')
    .controller('MenuNavigationsListController', MenuNavigationsListController);

  MenuNavigationsListController.$inject = ['MenuNavigationsService'];

  function MenuNavigationsListController(MenuNavigationsService) {
    var vm = this;

    vm.menuNavigations = MenuNavigationsService.query();
  }
}());
