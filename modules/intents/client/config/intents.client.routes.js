(function () {
  'use strict';

  angular
    .module('intents')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('intents', {
        abstract: true,
        url: '/developer/intents',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('intents.list', {
        url: '',
        templateUrl: 'modules/intents/client/views/list-intents.client.view.html',
        controller: 'IntentsListController',
        controllerAs: 'vm',
        resolve: {
          intentsResolve: getIntents
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('intents.create', {
        url: '/create',
        templateUrl: 'modules/intents/client/views/form-intent.client.view.html',
        controller: 'IntentsController',
        controllerAs: 'vm',
        resolve: {
          intentResolve: newIntent
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('intents.edit', {
        url: '/:intentId/edit',
        templateUrl: 'modules/intents/client/views/form-intent.client.view.html',
        controller: 'IntentsController',
        controllerAs: 'vm',
        resolve: {
          intentResolve: getIntent
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ intentResolve.name }}'
        }
      })
      .state('intents.view', {
        url: '/:intentId',
        templateUrl: 'modules/intents/client/views/view-intent.client.view.html',
        controller: 'IntentsController',
        controllerAs: 'vm',
        resolve: {
          intentResolve: getIntent
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getIntents.$inject = ['IntentsService', '$rootScope', '$cookies'];
  function getIntents(IntentsService, $rootScope, $cookies) {
    return IntentsService.query({botName: $cookies.get('default_bot')}).$promise;
    // return IntentsService.query({botName: $rootScope.botId}).$promise;
  }

  getIntent.$inject = ['$stateParams', 'IntentsService', '$rootScope', '$cookies'];
  function getIntent($stateParams, IntentsService, $rootScope, $cookies) {
    return IntentsService.get({
      // botName: $rootScope.botId,
      botName: $cookies.get('default_bot'),
      intentId: $stateParams.intentId
    }).$promise;
  }

  newIntent.$inject = ['IntentsService', '$rootScope'];
  function newIntent(IntentsService, $rootScope) {
    return new IntentsService({botName: $rootScope.botId});
  }
})();
