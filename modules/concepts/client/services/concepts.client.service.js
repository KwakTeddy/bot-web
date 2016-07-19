//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('concepts')
    .factory('ConceptsService', ConceptsService);

  ConceptsService.$inject = ['$resource'];

  function ConceptsService($resource) {
    return $resource('api/concepts/:conceptId', {
      conceptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
