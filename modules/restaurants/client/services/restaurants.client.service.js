//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('restaurants')
    .factory('RestaurantsService', RestaurantsService);

  RestaurantsService.$inject = ['$resource'];

  function RestaurantsService($resource) {
    return $resource('api/restaurants/:restaurantId', {
      restaurantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
