// Bot auths service used to communicate Bot auths REST endpoints
(function () {
  'use strict';

  angular
    .module('bot-auths')
    .factory('BotAuthsService', BotAuthsService);

  BotAuthsService.$inject = ['$resource'];

  function BotAuthsService($resource) {
    return $resource('api/bot-auths/:botAuthId', {
      botAuthId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
