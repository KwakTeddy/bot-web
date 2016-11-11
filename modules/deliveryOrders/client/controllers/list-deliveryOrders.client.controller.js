(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .controller('DeliveryOrdersListController', DeliveryOrdersListController);

  DeliveryOrdersListController.$inject = ['$scope', 'deliveryOrdersResolve', 'DTOptionsBuilder'];

  function DeliveryOrdersListController($scope, deliveryOrders, DTOptionsBuilder) {
    var vm = this;

    // $scope.dtOptions = DTOptionsBuilder.newOptions() .withOption('order', [1, 'desc']);
    // $scope.dtOptions = DTOptionsBuilder.newOptions() .withOption('aaSorting', [[3, 'desc']]);

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
