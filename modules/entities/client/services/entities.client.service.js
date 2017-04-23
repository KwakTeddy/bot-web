// Entities service used to communicate Entities REST endpoints
(function () {
  'use strict';

  angular
    .module('entities')
    // .factory('EntitiesService', EntitiesService)
    .factory('EntitiesService', ['$resource', function ($resource) {
      return $resource('api/entities/:entityId', {
        entityId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }])
    // .factory('EntityContentsService', EntityContentsService);
    .factory('EntityContentsService', ['$resource', function ($resource) {
      return $resource('api/entityContent/:entityId', {
        entityId: '@_id'
      }, {
        update: {
          method: 'PUT'
        },
        save: {
          method: 'POST'
        }
      });
    }]);

  // EntitiesService.$inject = ['$resource'];
  // EntityContentsService.$inject = ['$resource'];
  //
  // function EntitiesService($resource) {
  //   return $resource('api/entities/:entityId', {
  //     entityId: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     }
  //   });
  // }
  //
  // function EntityContentsService($resource) {
  //   return $resource('api/entityContent/:entityId', {
  //     entityId: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     },
  //     save: {
  //       method: 'POST'
  //     }
  //   });
  // }
}());
