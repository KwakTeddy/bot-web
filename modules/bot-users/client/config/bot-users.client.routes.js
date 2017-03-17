(function () {
  'use strict';

  angular
    .module('bot-users')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bot-users', {
        abstract: true,
        url: '/developer/bot-users',
        template: '<ui-view/>'
      })
      .state('bot-users.list', {
        url: '',
        templateUrl: 'modules/bot-users/client/views/list-bot-users.client.view.html',
        controller: 'BotUsersListController',
        controllerAs: 'vm',
        resolve: {
          botUsersResolve: getBotUsers
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bot users List'
        }
      })
      .state('bot-users.create', {
        url: '/create',
        templateUrl: 'modules/bot-users/client/views/form-bot-user.client.view.html',
        controller: 'BotUsersController',
        controllerAs: 'vm',
        resolve: {
          botUserResolve: newBotUser
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bot users Create'
        }
      })
      .state('bot-users.edit', {
        url: '/:botUserId/edit',
        templateUrl: 'modules/bot-users/client/views/form-bot-user.client.view.html',
        controller: 'BotUsersController',
        controllerAs: 'vm',
        resolve: {
          botUserResolve: getBotUser
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bot user {{ bot-userResolve.name }}'
        }
      })
      .state('bot-users.view', {
        url: '/:botUserId',
        templateUrl: 'modules/bot-users/client/views/view-bot-user.client.view.html',
        controller: 'BotUsersController',
        controllerAs: 'vm',
        resolve: {
          botUserResolve: getBotUser
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Bot user {{ articleResolve.name }}'
        }
      });
  }

  getBotUsers.$inject = ['BotUsersService'];
  function getBotUsers(BotUsersService) {
    return BotUsersService.query().$promise;
  }

  getBotUser.$inject = ['$stateParams', 'BotUsersService'];
  function getBotUser($stateParams, BotUsersService) {
    return BotUsersService.get({
      botUserId: $stateParams.botUserId
    }).$promise;
  }

  newBotUser.$inject = ['BotUsersService'];

  function newBotUser(BotUsersService) {
    return new BotUsersService();
  }
})();
