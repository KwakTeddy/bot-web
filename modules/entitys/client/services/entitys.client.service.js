//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('entitys')
    .factory('EntitysService', EntitysService);

  EntitysService.$inject = ['$resource'];

  function EntitysService($resource) {
    return $resource('api/entitys/:entityId', {
      entityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
