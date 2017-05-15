(function () {
  'use strict';

  angular
    .module('common-actions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('common-actions', {
        abstract: true,
        url: '/developer/common-actions',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('common-actions.list', {
        url: '',
        templateUrl: 'modules/common-actions/client/views/list-common-actions.client.view.html',
        controller: 'CommonActionsListController',
        controllerAs: 'vm',
        resolve: {
          commonActionsResolve: getCommonActions
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('common-actions.create', {
        url: '/create',
        templateUrl: 'modules/common-actions/client/views/form-common-action.client.view.html',
        controller: 'CommonActionsController',
        controllerAs: 'vm',
        resolve: {
          commonActionResolve: newCommonAction
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('common-actions.edit', {
        url: '/:commonActionId/edit',
        templateUrl: 'modules/common-actions/client/views/form-common-action.client.view.html',
        controller: 'CommonActionsController',
        controllerAs: 'vm',
        resolve: {
          commonActionResolve: getCommonAction
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ commonActionResolve.name }}'
        }
      })
      .state('common-actions.view', {
        url: '/:commonActionId',
        templateUrl: 'modules/common-actions/client/views/view-common-action.client.view.html',
        controller: 'CommonActionsController',
        controllerAs: 'vm',
        resolve: {
          commonActionResolve: getCommonAction
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getCommonActions.$inject = ['CommonActionsService'];
  function getCommonActions(CommonActionsService) {
    return CommonActionsService.query().$promise;
  }

  getCommonAction.$inject = ['$stateParams', 'CommonActionsService'];
  function getCommonAction($stateParams, CommonActionsService) {
    return CommonActionsService.get({
      commonActionId: $stateParams.commonActionId
    }).$promise;
  }

  newCommonAction.$inject = ['CommonActionsService'];
  function newCommonAction(CommonActionsService) {
    return new CommonActionsService();
  }
})();
