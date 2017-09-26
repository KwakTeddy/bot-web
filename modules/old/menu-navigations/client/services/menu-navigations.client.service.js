// Menu navigations service used to communicate Menu navigations REST endpoints
(function () {
  'use strict';

  angular
    .module('menu-navigations')
    .factory('MenuNavigationsService', MenuNavigationsService);

  MenuNavigationsService.$inject = ['$resource'];

  function MenuNavigationsService($resource) {
    return $resource('api/menu-navigations/:menuNavigationId', {
      menuNavigationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
