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

  angular
    .module('facts')
    .factory('FactAtomsService', FactsService);

  FactsAtomService.$inject = ['$resource'];

  function FactsAtomService($resource) {
    return $resource('api/factAtoms/:factId', {
      factId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('facts')
    .factory('FactLinksService', FactsService);

  FactsLinkService.$inject = ['$resource'];

  function FactsLinkService($resource) {
    return $resource('api/factLinks/:factId', {
      factId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

})();
