(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('franchises')
    .controller('FranchisesController', FranchisesController);

  FranchisesController.$inject = ['$scope', '$state', 'Authentication', 'franchiseResolve'];

  function FranchisesController($scope, $state, Authentication, franchise) {
    var vm = this;

    vm.authentication = Authentication;
    vm.franchise = franchise;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.franchise.$remove($state.go('franchises.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.franchiseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.franchise._id) {
        vm.franchise.$update(successCallback, errorCallback);
      } else {
        vm.franchise.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('franchises.list', {}, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
