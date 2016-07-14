//Bot users service used to communicate Bot users REST endpoints
(function () {
  'use strict';

  angular
    .module('bot-users')
    .factory('BotUsersService', BotUsersService);

  BotUsersService.$inject = ['$resource'];

  function BotUsersService($resource) {
    return $resource('api/bot-users/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
