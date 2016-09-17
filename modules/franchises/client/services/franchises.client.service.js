//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('franchises')
    .factory('FranchisesService', FranchisesService);

  FranchisesService.$inject = ['$resource'];

  function FranchisesService($resource) {
    return $resource('api/franchises/:franchiseId', {
      franchiseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
