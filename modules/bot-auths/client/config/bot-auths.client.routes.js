(function () {
  'use strict';

  angular
    .module('bot-auths')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bot-auths', {
        abstract: true,
        url: '/developer/bot-auths',
        template: '<ui-view/>'
      })
      .state('bot-auths.list', {
        url: '',
        templateUrl: 'modules/bot-auths/client/views/list-bot-auths.client.view.html',
        controller: 'BotAuthsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bot auths List'
        }
      })
      .state('bot-auths.create', {
        url: '/create',
        templateUrl: 'modules/bot-auths/client/views/form-bot-auth.client.view.html',
        controller: 'BotAuthsController',
        resolve: {
          botAuthResolve: newBotAuth
        },
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('bot-auths.edit', {
        url: '/:botId/edit/:userId',
        templateUrl: 'modules/bot-auths/client/views/form-bot-auth.client.view.html',
        controller: 'BotAuthsController',
        controllerAs: 'vm',
        // resolve: {
        //   botAuthResolve: getBotAuth
        // },
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('bot-auths.view', {
        url: '/:botAuthId',
        templateUrl: 'modules/bot-auths/client/views/view-bot-auth.client.view.html',
        controller: 'BotAuthsController',
        controllerAs: 'vm',
        resolve: {
          botAuthResolve: getBotAuth
        },
        data: {
          pageTitle: 'Bot auth {{ bot-authResolve.name }}'
        }
      });
  }

  getBotAuth.$inject = ['$stateParams', 'BotAuthsService'];

  function getBotAuth($stateParams, BotAuthsService) {
    return BotAuthsService.get({
      botId: $stateParams.botId,
      userId: $stateParams.userId,
    }).$promise;
  }

  newBotAuth.$inject = ['BotAuthsService'];

  function newBotAuth(BotAuthsService) {
    return new BotAuthsService();
  }
}());
