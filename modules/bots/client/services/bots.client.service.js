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
])
  .factory('BotFilesService', ['$resource',
    function ($resource) {
      return $resource('api/bots/files/:botId/:fileId', {
        botId: '@botId',
        fileId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }]);

angular.module('bots').factory('Dialogs', ['$resource',
  function ($resource) {
    return $resource('api/dialog/:botId/:dialogId', {
      botId: '@botId',
      dialogId: '@dialogId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
