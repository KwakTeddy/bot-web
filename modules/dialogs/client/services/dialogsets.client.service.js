//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('dialogsets')
    .factory('DialogsetsService', DialogsetsService);

  DialogsetsService.$inject = ['$resource'];

  function DialogsetsService($resource) {
    return $resource('api/dialogsets/:dialogsetId', {
      dialogsetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('dialogsets')
    .factory('DialogsetDialogsService', DialogsetDialogsService);

  DialogsetDialogsService.$inject = ['$resource'];

  function DialogsetDialogsService($resource) {
    return $resource('api/dialogsets/:dialogsetId/dialogs/:dialogId', {
      dialogsetId: '@dialogset', dialogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

})();
