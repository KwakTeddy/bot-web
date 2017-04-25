//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('intents')
    .factory('IntentsService', IntentsService);

  IntentsService.$inject = ['$resource'];

  function IntentsService($resource) {
    return $resource('api/intents/:intentId', {
      intentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
