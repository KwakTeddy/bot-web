'use strict';

//Bots service used for communicating with the bots REST endpoints
angular.module('bots').factory('BotsService', ['$resource',
  function ($resource) {
    return $resource('api/bots/:botId', {
      botId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]).factory('BotFilesService', ['$resource',
function($resource) {
  return $resource('api/bots/files/:botId', {
    botId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
