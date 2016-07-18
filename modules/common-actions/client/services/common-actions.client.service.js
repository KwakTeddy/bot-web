//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('common-actions')
    .factory('CommonActionsService', CommonActionsService);

  CommonActionsService.$inject = ['$resource'];

  function CommonActionsService($resource) {
    return $resource('api/common-actions/:commonActionId', {
      commonActionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
