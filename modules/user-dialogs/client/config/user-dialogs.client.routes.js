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
        url: '/bot-users',
        template: '<ui-view/>'
      })
      .state('bot-users.list', {
        url: '',
        templateUrl: 'modules/bot-users/client/views/list-bot-users.client.view.html',
        controller: 'UserDialogsListController',
        controllerAs: 'vm',
        resolve: {
          userDialogsResolve: getUserDialogs
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bot users List'
        }
      })
      .state('bot-users.create', {
        url: '/create',
        templateUrl: 'modules/bot-users/client/views/form-bot-user.client.view.html',
        controller: 'UserDialogsController',
        controllerAs: 'vm',
        resolve: {
          userDialogResolve: newUserDialog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bot users Create'
        }
      })
      .state('bot-users.edit', {
        url: '/:userDialogId/edit',
        templateUrl: 'modules/bot-users/client/views/form-bot-user.client.view.html',
        controller: 'UserDialogsController',
        controllerAs: 'vm',
        resolve: {
          userDialogResolve: getUserDialog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bot user {{ bot-userResolve.name }}'
        }
      })
      .state('bot-users.view', {
        url: '/:userDialogId',
        templateUrl: 'modules/bot-users/client/views/view-bot-user.client.view.html',
        controller: 'UserDialogsController',
        controllerAs: 'vm',
        resolve: {
          userDialogResolve: getUserDialog
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Bot user {{ articleResolve.name }}'
        }
      });
  }

  getUserDialogs.$inject = ['UserDialogsService'];
  function getUserDialogs(UserDialogsService) {
    return UserDialogsService.query().$promise;
  }

  getUserDialog.$inject = ['$stateParams', 'UserDialogsService'];
  function getUserDialog($stateParams, UserDialogsService) {
    return UserDialogsService.get({
      userDialogId: $stateParams.userDialogId
    }).$promise;
  }

  newUserDialog.$inject = ['UserDialogsService'];

  function newUserDialog(UserDialogsService) {
    return new UserDialogsService();
  }
})();
