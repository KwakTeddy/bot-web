(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('concepts')
    .controller('ConceptsController', ConceptsController);

  ConceptsController.$inject = ['$scope', '$state', 'Authentication', 'conceptResolve'];

  function ConceptsController($scope, $state, Authentication, concept) {
    var vm = this;

    vm.authentication = Authentication;
    vm.concept = concept;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.concept.$remove($state.go('concepts.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.conceptForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.concept._id) {
        vm.concept.$update(successCallback, errorCallback);
      } else {
        vm.concept.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('concepts.list', {
          conceptId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
