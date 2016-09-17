(function () {
  'use strict';

  angular
    .module('restaurants')
    .controller('RestaurantsListController', RestaurantsListController);

  RestaurantsListController.$inject = ['restaurantsResolve'];

  function RestaurantsListController(restaurants) {
    var vm = this;

    vm.restaurants = restaurants;
  }
})();
