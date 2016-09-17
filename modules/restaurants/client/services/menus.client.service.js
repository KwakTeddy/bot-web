//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('restaurants')
    .factory('MenusService', MenusService);

  MenusService.$inject = ['$resource'];

  function MenusService($resource) {
    return $resource('api/restaurants/:restaurantId/menus', {
      restaurantId: '@restaurant'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
