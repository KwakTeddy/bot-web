(function () {
  'use strict';

  // Banks controller
  angular
    .module('banks')
    .controller('BanksController', BanksController);

  BanksController.$inject = ['$scope', '$state', 'Authentication', 'bankResolve'];

  function BanksController ($scope, $state, Authentication, bank) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bank = bank;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bank
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.bank.$remove($state.go('banks.list'));
      }
    }

    // Save Bank
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bankForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bank._id) {
        vm.bank.$update(successCallback, errorCallback);
      } else {
        vm.bank.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('banks.view', {
          bankId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
