(function () {
  'use strict';

  angular
    .module('user-dialogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user-dialogs', {
        abstract: true,
        url: '/user-dialogs',
        template: '<ui-view/>'
      })
      .state('user-dialogs.list', {
        url: '',
        templateUrl: 'modules/user-dialogs/client/views/list-user-dialogs.client.view.html',
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
      .state('user-dialogs.create', {
        url: '/create',
        templateUrl: 'modules/user-dialogs/client/views/form-user-dialog.client.view.html',
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
      .state('user-dialogs.edit', {
        url: '/:userDialogId/edit',
        templateUrl: 'modules/user-dialogs/client/views/form-user-dialog.client.view.html',
        controller: 'UserDialogsController',
        controllerAs: 'vm',
        resolve: {
          userDialogResolve: getUserDialog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bot user {{ user-dialogResolve.name }}'
        }
      })
      .state('user-dialogs.view', {
        url: '/:userDialogId',
        templateUrl: 'modules/user-dialogs/client/views/view-user-dialog.client.view.html',
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
