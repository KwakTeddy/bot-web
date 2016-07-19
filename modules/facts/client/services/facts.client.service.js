//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('facts')
    .factory('FactsService', FactsService);

  FactsService.$inject = ['$resource'];

  function FactsService($resource) {
    return $resource('api/facts/:factId', {
      factId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
