//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('dicts')
    .factory('DictsService', DictsService);

  DictsService.$inject = ['$resource'];

  function DictsService($resource) {
    return $resource('api/dicts/:dictId', {
      dictId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
