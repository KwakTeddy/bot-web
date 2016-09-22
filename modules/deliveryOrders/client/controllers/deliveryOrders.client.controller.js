(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('deliveryOrders')
    .controller('DeliveryOrdersController', DeliveryOrdersController);

  DeliveryOrdersController.$inject = ['$scope', '$state', 'Authentication', 'deliveryOrderResolve'];

  function DeliveryOrdersController($scope, $state, Authentication, deliveryOrder) {
    var vm = this;

    vm.authentication = Authentication;
    vm.deliveryOrder = deliveryOrder;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.deliveryOrder.$remove($state.go('deliveryOrders.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.deliveryOrderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.deliveryOrder._id) {
        vm.deliveryOrder.$update(successCallback, errorCallback);
      } else {
        vm.deliveryOrder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('deliveryOrders.list', {}, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
