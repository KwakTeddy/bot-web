'use strict';

// Setting up route
angular.module('user-bots').config(['$stateProvider',
  function ($stateProvider) {
    // UserBots state routing
    $stateProvider
      .state('user-bots', {
        abstract: true,
        url: '/developer/user-bots',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin'],
        }
      })
      .state('user-bots.list', {
        url: '',
        templateUrl: 'modules/bots/client/views/list-user-bots.client.view.html',
        controller: 'UserBotListController',
        controllerAs: 'vm',
        resolve: {
          botResolve: getBot,
          userBotsResolve: getUserBots
        }
      })
      .state('user-bots.create', {
        url: '/create',
        templateUrl: 'modules/bots/client/views/edit-user-bot.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: newUserBot
        }
      })
      .state('user-bots.edit', {
        url: '/:userBotId/edit',
        templateUrl: 'modules/bots/client/views/edit-user-bot.client.view.html',
        controller: 'UserBotController',
        controllerAs: 'vm',
        resolve: {
          userBotResolve: getUserBot
        }
      })
      .state('user-bots.ide', {
        url: '/ide/:userBotId/:fileId',
        templateUrl: 'modules/bots/client/views/ide.client.view.html',
        controller: 'IDEController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: readUserBotFile
        }
      })
      .state('user-bots.files', {
        url: '/:userBotId/files',
        templateUrl: 'modules/bots/client/views/files-user-bot.client.view.html',
        controller: 'UserBotFilesController',
        controllerAs: 'vm',
        resolve: {
          userBotFilesResolve: getUserBotFiles
        }
      })
      .state('user-bots.context-analytics', {
        url: '/context-analytics',
        templateUrl: 'modules/bots/client/views/context-analytics.client.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })

      .state('user-bots.context-learning', {
        url: '/context-learning',
        templateUrl: 'modules/bots/client/views/context-learning.client.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })

    ;
  }
]);

getUserBots.$inject = ['UserBotsService', '$stateParams'];
function getUserBots(UserBotsService, $stateParams) {
  return UserBotsService.query().$promise;
}

getUserBot.$inject = ['UserBotsService', '$stateParams'];
function getUserBot(UserBotsService, $stateParams) {
  // console.log($stateParams.userBotId);
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

//
// getBots.$inject = ['BotsService'];
// function getBots(BotsService) {
//     return BotsService.query().$promise;
// }
//
// getBot.$inject = ['BotsService', '$stateParams'];
// function getBot(BotsService, $stateParams) {
//   console.log(34512);
//     return BotsService.get({
//         botId: $stateParams.botId
//     }).$promise;
// }
//
// newBot.$inject = ['BotsService'];
// function newBot(BotsService) {
//     return new BotsService();
// }
//
// getBotFiles.$inject = ['BotFilesService', '$stateParams'];
// function getBotFiles(BotFilesService, $stateParams) {
//     return BotFilesService.query({
//         botId: $stateParams.botId
//     }).$promise;
// }
// readBotFile.$inject = ['BotFilesService', '$stateParams'];
// function readBotFile(BotFilesService, $stateParams) {
//     return BotFilesService.get({
//         botId: $stateParams.botId,
//         fileId: $stateParams.fileId
//     }).$promise;
// }
