(function () {
  'use strict';

  // Entities controller
  angular
    .module('entities')
    .controller('EntitiesController', EntitiesController);

  EntitiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'entityContentsResolve'];

  function EntitiesController ($scope, $state, $window, Authentication, entityContent) {
    var vm = this;
    console.log(entityContent);
    vm.authentication = Authentication;
    vm.entityContent = entityContent;

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Entity
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.entity.$remove($state.go('entities.list'));
      }
    }

    // Save Entity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.entity._id) {
        vm.entity.$update(successCallback, errorCallback);
      } else {
        vm.entity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('entities.view', {
          entityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.saveContent = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityContentForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.entityContent._id) {
        vm.entityContent.$update(successCallback, errorCallback);
      } else {
        vm.entityContent.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('entities.view', {
          entityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
