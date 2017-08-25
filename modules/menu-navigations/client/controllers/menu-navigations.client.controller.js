(function () {
  'use strict';

  // Menu navigations controller
  angular
    .module('menu-navigations')
    .controller('MenuNavigationsController', MenuNavigationsController);

  MenuNavigationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'menuNavigationResolve'];

  function MenuNavigationsController ($scope, $state, $window, Authentication, menuNavigation) {
    var vm = this;

    vm.authentication = Authentication;
    vm.menuNavigation = menuNavigation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Menu navigation
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.menuNavigation.$remove($state.go('menu-navigations.list'));
      }
    }

    // Save Menu navigation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.menuNavigationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.menuNavigation._id) {
        vm.menuNavigation.$update(successCallback, errorCallback);
      } else {
        console.log(vm.menuNavigation)
        vm.menuNavigation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('menu-navigations.view', {
          menuNavigationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
