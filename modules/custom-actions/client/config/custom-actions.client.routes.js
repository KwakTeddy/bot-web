(function () {
  'use strict';

  angular
    .module('custom-actions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('custom-actions', {
        abstract: true,
        url: '/custom-actions',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('custom-actions.list', {
        url: '',
        templateUrl: 'modules/custom-actions/client/views/list-custom-actions.client.view.html',
        controller: 'CustomActionsListController',
        controllerAs: 'vm',
        resolve: {
          customActionsResolve: getCustomActions
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('custom-actions.create', {
        url: '/create',
        templateUrl: 'modules/custom-actions/client/views/form-custom-action.client.view.html',
        controller: 'CustomActionsController',
        controllerAs: 'vm',
        resolve: {
          customActionResolve: newCustomAction
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('custom-actions.edit', {
        url: '/:customActionId/edit',
        templateUrl: 'modules/custom-actions/client/views/form-custom-action.client.view.html',
        controller: 'CustomActionsController',
        controllerAs: 'vm',
        resolve: {
          customActionResolve: getCustomAction
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ customActionResolve.name }}'
        }
      })
      .state('custom-actions.view', {
        url: '/:customActionId',
        templateUrl: 'modules/custom-actions/client/views/view-custom-action.client.view.html',
        controller: 'CustomActionsController',
        controllerAs: 'vm',
        resolve: {
          customActionResolve: getCustomAction
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getCustomActions.$inject = ['CustomActionsService'];
  function getCustomActions(CustomActionsService) {
    return CustomActionsService.query().$promise;
  }

  getCustomAction.$inject = ['$stateParams', 'CustomActionsService'];
  function getCustomAction($stateParams, CustomActionsService) {
    return CustomActionsService.get({
      customActionId: $stateParams.customActionId
    }).$promise;
  }

  newCustomAction.$inject = ['CustomActionsService'];
  function newCustomAction(CustomActionsService) {
    return new CustomActionsService();
  }
})();
