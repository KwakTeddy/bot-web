//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('custom-actions')
    .factory('CustomActionsService', CustomActionsService);

  CustomActionsService.$inject = ['$resource'];

  function CustomActionsService($resource) {
    return $resource('api/custom-actions/:customActionId', {
      customActionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
