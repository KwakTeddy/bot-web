//Banks service used to communicate Banks REST endpoints
(function () {
  'use strict';

  angular
    .module('banks')
    .factory('BanksService', BanksService);

  BanksService.$inject = ['$resource'];

  function BanksService($resource) {
    return $resource('api/banks/:userKey', {
      userKey: '@userKey'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
