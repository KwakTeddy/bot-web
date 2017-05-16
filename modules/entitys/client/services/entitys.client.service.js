//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('entitys')
    .factory('EntitysService', EntitysService);

  EntitysService.$inject = ['$resource'];

  function EntitysService($resource) {
    return $resource('api/entitys/:botName/:entityId', {
      entityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('entitys')
    .factory('EntityContentsService', EntityContentsService);

  EntityContentsService.$inject = ['$resource'];

  function EntityContentsService($resource) {
    return $resource('api/entityContents/:botName/:entityId', {
      entityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

})();
