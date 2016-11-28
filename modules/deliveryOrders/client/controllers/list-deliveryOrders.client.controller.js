(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .controller('DeliveryOrdersListController', DeliveryOrdersListController);

  DeliveryOrdersListController.$inject = ['$scope', 'deliveryOrdersResolve', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

  function DeliveryOrdersListController($scope, deliveryOrders, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;

    vm.dtOptions = DTOptionsBuilder.newOptions() .withOption('order', [0
      , 'desc']);

    vm.deliveryOrders = deliveryOrders;

    vm.updateStatus = function(deliveryOrder, status, memo) {
      deliveryOrder.status = status;
      deliveryOrder.$update(function(res) {

        // console.log(res);
      }, function(res) {
        vm.error = res.data.message;
      });
    };
  }
})();
