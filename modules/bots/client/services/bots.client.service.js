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
    }])
  .factory('BotsFollowService', ['$resource',
    function ($resource) {
      return $resource('api/bots/follow', null, {
        list: {
          method: 'POST', isArray: true
        },
        follow: {
          method: 'PUT'
        },
        unfollow: {
          method: 'DELETE'
        }
      });
    }
  ])

  .factory('BotCommentService', ['$resource',
    function ($resource) {
      return $resource('api/bots-comment/:botId/:commentId', {
        botId: '@botId',
        commentId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }])
  .factory('BotDialogService', ['$resource',
    function ($resource) {
      return $resource('api/bots-dialog/:botId/:dialogId', {
        botId: '@botId',
        dialogId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }])

;

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


angular
  .module('bots')
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
  .module('bots')
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
