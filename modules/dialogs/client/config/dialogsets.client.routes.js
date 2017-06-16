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
          roles: ['user', 'enterprise', 'admin'],
        }
      })
      .state('dialogsets.list', {
        url: '?listType',
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
      .state('dialogsets.concepts', {
        url: '/concept_tree?kind',
        templateUrl: 'modules/dialogs/client/views/concept-tree.client.view.html',
        controller: 'ConceptTreeController',
        controllerAs: 'vm',
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
          // roles: ['user', 'enterprise', 'admin'],
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
          // roles: ['user', 'enterprise', 'admin'],
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
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('dialogsets.dialogsLearn', {
        url: '/dialogsLearn/:botNameId/',
        templateUrl: 'modules/dialogs/client/views/dialogs.client.view.html',
        controller: 'DialogsetDialogsLearnController',
        controllerAs: 'vm',
        resolve: {
          botResolve : getBot,
          dialogsResolve: getDialogs
        }
      })
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

  getBot.$inject = ['$http', '$cookies'];
  function getBot($http, $cookies) {
    return $http.get('/api/bots/byNameId/' + $cookies.get('default_bot'))
  }

  getDialogs.$inject = ['UserBotDialogService', '$cookies'];
  function getDialogs(UserBotDialogService, $cookies) {
    return UserBotDialogService.query({botId: $cookies.get('default_bot')}).$promise;
  }

})();
