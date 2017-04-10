'use strict';

//UserBots service used for communicating with the userBots REST endpoints
angular.module('user-bots').factory('UserBotsService', ['$resource',
  function ($resource) {
    return $resource('api/bots/:userBotId', {
      userBotId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  ])
  .factory('UserBotsGraphService', ['$resource',
    function ($resource) {
      return $resource('api/graph/:userBotId', {
        userBotId: '@userBotId',
      }, {
        update: {
          method: 'PUT'
        }
      });
    }])
  .factory('UserBotsFollowService', ['$resource',
    function ($resource) {
      return $resource('api/follow', null, {
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
  .factory('UserBotFilesService', ['$resource',
    function ($resource) {
      return $resource('api/bots/files/:userBotId/:fileId', {
        userBotId: '@userBotId',
        fileId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
  }])

  .factory('UserBotCommentService', ['$resource',
    function ($resource) {
      return $resource('api/bots-comment/:userBotId/:commentId', {
        userBotId: '@userBotId',
        commentId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }])
  .factory('UserBotDialogService', ['$resource',
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
