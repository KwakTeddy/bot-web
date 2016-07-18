(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('canonicals')
    .controller('CanonicalsController', CanonicalsController);

  CanonicalsController.$inject = ['$scope', '$state', 'Authentication', 'canonicalResolve'];

  function CanonicalsController($scope, $state, Authentication, canonical) {
    var vm = this;

    vm.authentication = Authentication;
    vm.canonical = canonical;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.canonical.$remove($state.go('canonicals.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.canonicalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.canonical._id) {
        vm.canonical.$update(successCallback, errorCallback);
      } else {
        vm.canonical.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('canonicals.list', {
          canonicalId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
