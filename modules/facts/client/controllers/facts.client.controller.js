(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('facts')
    .controller('FactsController', FactsController);

  FactsController.$inject = ['$scope', '$state', 'Authentication', 'factResolve'];

  function FactsController($scope, $state, Authentication, fact) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fact = fact;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.fact.$remove($state.go('facts.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.factForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fact._id) {
        vm.fact.$update(successCallback, errorCallback);
      } else {
        vm.fact.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('facts.list', {
          factId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
