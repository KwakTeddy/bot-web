//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('franchises')
    .factory('FranchiseMenusService', FranchiseMenusService);

  FranchiseMenusService.$inject = ['$resource'];

  function FranchiseMenusService($resource) {
    return $resource('api/franchises/:franchiseId/menus', {
      franchiseId: '@franchise'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
