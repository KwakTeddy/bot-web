(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .controller('DeliveryOrdersListController', DeliveryOrdersListController);

  DeliveryOrdersListController.$inject = ['deliveryOrdersResolve'];

  function DeliveryOrdersListController(deliveryOrders) {
    var vm = this;

    vm.deliveryOrders = deliveryOrders;
  }
})();
