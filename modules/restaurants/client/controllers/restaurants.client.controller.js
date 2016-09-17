(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('restaurants')
    .controller('RestaurantsController', RestaurantsController);

  RestaurantsController.$inject = ['$scope', '$state', 'Authentication', 'restaurantResolve'];

  function RestaurantsController($scope, $state, Authentication, restaurant) {
    var vm = this;

    vm.authentication = Authentication;
    vm.restaurant = restaurant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.restaurant.$remove($state.go('restaurants.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.restaurantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.restaurant._id) {
        vm.restaurant.$update(successCallback, errorCallback);
      } else {
        vm.restaurant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('restaurants.list', {
          restaurantId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
