(function () {
  'use strict';

  // Convergences controller
  angular
    .module('convergences')
    .controller('ConvergencesController', ConvergencesController);

  ConvergencesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'convergenceResolve'];

  function ConvergencesController ($scope, $state, $window, Authentication, convergence) {
    var vm = this;

    vm.authentication = Authentication;
    vm.convergence = convergence;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Convergence
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.convergence.$remove($state.go('convergences.list'));
      }
    }

    // Save Convergence
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.convergenceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.convergence._id) {
        vm.convergence.$update(successCallback, errorCallback);
      } else {
        vm.convergence.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('convergences.view', {
          convergenceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
