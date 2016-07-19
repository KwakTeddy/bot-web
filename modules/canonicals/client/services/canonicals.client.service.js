//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('canonicals')
    .factory('CanonicalsService', CanonicalsService);

  CanonicalsService.$inject = ['$resource'];

  function CanonicalsService($resource) {
    return $resource('api/canonicals/:canonicalId', {
      canonicalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
