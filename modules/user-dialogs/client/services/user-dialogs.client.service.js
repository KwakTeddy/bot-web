//Bot users service used to communicate Bot users REST endpoints
(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .factory('UserDialogsService', UserDialogsService);

  UserDialogsService.$inject = ['$resource'];

  function UserDialogsService($resource) {
    return $resource('api/user-dialogs/:userDialogId', {
      userDialogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
