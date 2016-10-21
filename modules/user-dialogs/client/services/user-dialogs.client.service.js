//Bot users service used to communicate Bot users REST endpoints
(function () {
  'use strict';

  angular
    .module('bot-users')
    .factory('UserDialogsService', UserDialogsService);

  UserDialogsService.$inject = ['$resource'];

  function UserDialogsService($resource) {
    return $resource('api/bot-users/:userDialogId', {
      userDialogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
