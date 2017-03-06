'use strict';

// Setting up route
angular.module('user-bots').config(['$stateProvider',
  function ($stateProvider) {
    // UserBots state routing
    $stateProvider
      .state('user-bots-web', {
        abstract: true,
        url: '/userbot',
        template: '<ui-view/>'
      })
      .state('user-bots-home', {
        url: '/userbot/home',
        templateUrl: 'modules/core/client/views/user.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          userBotsResolve: getUserBotsWeb
        }
      })
      .state('user-bots-web.list', {
        url: '?listType&query',
        templateUrl: 'modules/bots/client/views/list-user-bot-web.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          userBotsResolve: getUserBotsWeb
        }
      })
      .state('user-bots-web.create', {
        url: '/create',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: newUserBot
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('user-bots-web.edit', {
        url: '/:userBotId/edit',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBot
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('user-bots-web.view', {
        url: '/:userBotId/view',
        templateUrl: 'modules/bots/client/views/edit-user-bot-web.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBot
        },
        data: {
          roles: ['guest','user', 'admin']
        }
      })
    ;
  }
]);

getUserBotsWeb.$inject = ['UserBotsService', 'UserBotsFollowService', '$stateParams', '$rootScope'];
function getUserBotsWeb(UserBotsService, UserBotsFollowService, $stateParams, $rootScope) {
  if($stateParams['query']) {
    return UserBotsService.query({query: $stateParams['query']}).$promise;
  } else if($stateParams['listType']) {
    if($stateParams['listType'] == 'popular') return UserBotsService.query({sort: '-followed'}).$promise;
    else if($stateParams['listType'] == 'followed') return UserBotsFollowService.list({botUserId: $rootScope['userId']}).$promise;
    else if($stateParams['listType'] == 'my') return UserBotsService.query({my: '1'}).$promise;
    else return UserBotsService.query().$promise;
  } else {
    return UserBotsService.query().$promise;
  }
}

getUserBot.$inject = ['UserBotsService', '$stateParams'];
function getUserBot(UserBotsService, $stateParams) {
  return UserBotsService.get({
    userBotId: $stateParams.userBotId
  }).$promise;
}

newUserBot.$inject = ['UserBotsService'];
function newUserBot(UserBotsService) {
  return new UserBotsService();
}

getUserBotFiles.$inject = ['UserBotFilesService', '$stateParams'];
function getUserBotFiles(UserBotFilesService, $stateParams) {
  return UserBotFilesService.query({
    userBotId: $stateParams.userBotId
  }).$promise;
}
readUserBotFile.$inject = ['UserBotFilesService', '$stateParams'];
function readUserBotFile(UserBotFilesService, $stateParams) {
  return UserBotFilesService.get({
    userBotId: $stateParams.userBotId,
    fileId: $stateParams.fileId
  }).$promise;
}
