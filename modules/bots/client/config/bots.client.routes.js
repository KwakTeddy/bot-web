'use strict';

// Setting up route
angular.module('bots').config(['$stateProvider',
  function ($stateProvider) {
    // Bots state routing
    $stateProvider
      .state('bots', {
        abstract: true,
        url: '/developer/bots',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('bots.list', {
        url: '',
        templateUrl: 'modules/bots/client/views/list-bots.client.view.html',
        controller: 'BotListController',
        controllerAs: 'vm',
        resolve: {
          botsResolve: getBots
        }
      })
      .state('bots.create', {
        url: '/create',
        templateUrl: 'modules/bots/client/views/edit-bot.client.view.html',
        controller: 'BotController',
        controllerAs: 'vm',
        resolve: {
          botResolve: newBot,
          dialogsetsResolve: getDialogsets
        }
      })
      .state('bots.edit', {
        url: '/:botId/edit',
        templateUrl: 'modules/bots/client/views/edit-bot.client.view.html',
        controller: 'BotController',
        controllerAs: 'vm',
        resolve: {
          botResolve: getBot,
          dialogsetsResolve: getDialogsets
        }
      })
      .state('bots.ide', {
        url: '/ide/:botId/:fileId',
        templateUrl: 'modules/bots/client/views/ide.client.view.html',
        controller: 'IDEController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: readBotFile
        }
      })
      .state('bots.files', {
        url: '/:botId/files',
        templateUrl: 'modules/bots/client/views/files-bot.client.view.html',
        controller: 'BotFilesController',
        controllerAs: 'vm',
        resolve: {
          botResolve: getBot,
          botFilesResolve: getBotFiles
        }
      })
      .state('bots.graph-dialog', {
        url: '/graph-dialog/:botId/:fileId',
        templateUrl: 'modules/bots/client/views/graph-dialog.client.view.html',
        controller: 'GraphDialogController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: readBotFile
        }
      })
      .state('bots.dialog-tree', {
        url: '/dialog-tree/:botId/:fileId',
        templateUrl: 'modules/bots/client/views/dialog-tree.client.view.html',
        controller: 'DialogTreeController',
        controllerAs: 'vm',
        resolve: {
          botFilesResolve: getBotFiles,
          fileResolve: readBotFile
        }
      })
      .state('bots.dialog-tree2', {
        url: '/dialog-tree2/',
        templateUrl: 'modules/bots/client/views/dialog-tree.client.view.html',
        controller: 'DialogTreeController',
        controllerAs: 'vm',
        resolve: {
          botFilesResolve: getBotFiles,
          fileResolve: readBotFile
        },
      })
      .state('bots.dialog-graph', {
        url: '/dialog-graph/:botId/:fileId',
        templateUrl: 'modules/bots/client/views/dialog-graph.client.view.html',
        controller: 'DialogGraphController',
        controllerAs: 'vm',
        resolve: {
          botFilesResolve: getBotFiles,
          fileResolve: readBotFile
        }
      })
      .state('bots.dialog-graph2', {
        url: '/dialog-graph2/',
        templateUrl: 'modules/bots/client/views/dialog-graph.client.view.html',
        controller: 'DialogGraphController',
        controllerAs: 'vm',
        resolve: {
          botResolve: getBot,
          botFilesResolve: getBotFiles,
          fileResolve: readBotFile
        }
      })
      .state('bots.graph-knowledge', {
        url: '/graph-knowledge/:botId',
        templateUrl: 'modules/bots/client/views/graph-knowledge.client.view.html',
        controller: 'GraphKnowledgeController',
        controllerAs: 'vm'
        // resolve: {
        //   fileResolve: readBotFile
        // }
      })
    ;
  }
]);

getBots.$inject = ['BotsService', 'Authentication'];
function getBots(BotsService, Authentication) {
  return BotsService.query({my: 1, developer: true, role: Authentication.user.roles}).$promise;
}

getBot.$inject = ['BotsService', '$stateParams', '$cookies'];
function getBot(BotsService, $stateParams, $cookies) {
  return BotsService.get({
    botId: $stateParams.botId || $cookies.get("botObjectId")
  }).$promise;
}

newBot.$inject = ['BotsService'];
function newBot(BotsService) {
  return new BotsService();
}

getBotFiles.$inject = ['BotFilesService', '$stateParams', '$rootScope', '$cookies'];
function getBotFiles(BotFilesService, $stateParams, $rootScope, $cookies) {
  var _botId = $stateParams.botId ? $stateParams.botId : $cookies.get('botObjectId');

  return BotFilesService.query({
    botId: _botId
  }).$promise;
}

readBotFile.$inject = ['BotFilesService', '$stateParams', '$rootScope', '$resource', '$cookies'];
function readBotFile(BotFilesService, $stateParams, $rootScope, $resource, $cookies) {
  // console.log('readBotFile:' + $rootScope.botObjectId);
  var _botId = $stateParams.botId ? $stateParams.botId :  $cookies.get('botObjectId');
  var _fileId = $stateParams.fileId ? $stateParams.fileId : 'none';
  return BotFilesService.get({
    botId: _botId,
    fileId: _fileId
  }).$promise;

}

newBotFile.$inject = ['BotFilesService'];
function newBotFile(BotFilesService) {
  return new BotFilesService();
}

getDialogsets.$inject = ['DialogsetsService'];
function getDialogsets(DialogsetsService) {
  return DialogsetsService.query().$promise;
}

getDialogset.$inject = ['$stateParams', 'DialogsetsService'];
function getDialogset($stateParams, DialogsetsService) {
  return DialogsetsService.get({
    dialogsetId: $stateParams.dialogsetId
  }).$promise;
}

newDialogset.$inject = ['DialogsetsService'];
function newDialogset(DialogsetsService) {
  return new DialogsetsService();
}

getDialogsetDialogs.$inject = ['$stateParams', 'DialogsetDialogsService'];
function getDialogsetDialogs($stateParams, DialogsetDialogsService) {
  return DialogsetDialogsService.query({
    dialogsetId: $stateParams.dialogsetId
  }).$promise;
}
