(function () {
  'use strict';

  angular
    .module('dialogsets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dialogsets', {
        abstract: true,
        url: '/developer/dialogsets',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dialogsets.list', {
        url: '',
        templateUrl: 'modules/dialogs/client/views/list-dialogsets.client.view.html',
        controller: 'DialogsetsListController',
        controllerAs: 'vm',
        resolve: {
          dialogsetsResolve: getDialogsets
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('dialogsets.create', {
        url: '/create',
        templateUrl: 'modules/dialogs/client/views/form-dialogset.client.view.html',
        controller: 'DialogsetsController',
        controllerAs: 'vm',
        resolve: {
          dialogsetResolve: newDialogset
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('dialogsets.edit', {
        url: '/:dialogsetId/edit',
        templateUrl: 'modules/dialogs/client/views/form-dialogset.client.view.html',
        controller: 'DialogsetsController',
        controllerAs: 'vm',
        resolve: {
          dialogsetResolve: getDialogset
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ dialogsetResolve.name }}'
        }
      })
      .state('dialogsets.view', {
        url: '/:dialogsetId',
        templateUrl: 'modules/dialogs/client/views/view-dialogset.client.view.html',
        controller: 'DialogsetsController',
        controllerAs: 'vm',
        resolve: {
          dialogsetResolve: getDialogset
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('dialogsets.dialogs', {
        url: '/:dialogsetId/dialogs',
        templateUrl: 'modules/dialogs/client/views/form-dialogsetdialog.client.view.html',
        controller: 'DialogsetDialogsController',
        controllerAs: 'vm',
        resolve: {
          dialogsetResolve: getDialogset,
          dialogsetDialogResolve: getDialogsetDialogs
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })

    ;
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

})();
