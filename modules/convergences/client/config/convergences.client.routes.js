(function () {
  'use strict';

  angular
    .module('convergences')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('convergences', {
        abstract: true,
        url: '/developer/convergences',
        template: '<ui-view/>'
      })
      .state('convergences.list', {
        url: '',
        templateUrl: 'modules/convergences/client/views/list-convergences.client.view.html',
        controller: 'ConvergencesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Convergences List'
        }
      })
      .state('convergences.create', {
        url: '/create',
        templateUrl: 'modules/convergences/client/views/form-convergence.client.view.html',
        controller: 'ConvergencesController',
        controllerAs: 'vm',
        resolve: {
          convergenceResolve: newConvergence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Convergences Create'
        }
      })
      .state('convergences.edit', {
        url: '/:convergenceId/edit',
        templateUrl: 'modules/convergences/client/views/form-convergence.client.view.html',
        controller: 'ConvergencesController',
        controllerAs: 'vm',
        resolve: {
          convergenceResolve: getConvergence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Convergence {{ convergenceResolve.name }}'
        }
      })
      .state('convergences.view', {
        url: '/:convergenceId',
        templateUrl: 'modules/convergences/client/views/view-convergence.client.view.html',
        controller: 'ConvergencesController',
        controllerAs: 'vm',
        resolve: {
          convergenceResolve: getConvergence
        },
        data: {
          pageTitle: 'Convergence {{ convergenceResolve.name }}'
        }
      });
  }

  getConvergence.$inject = ['$stateParams', 'ConvergencesService'];

  function getConvergence($stateParams, ConvergencesService) {
    return ConvergencesService.get({
      convergenceId: $stateParams.convergenceId
    }).$promise;
  }

  newConvergence.$inject = ['ConvergencesService'];

  function newConvergence(ConvergencesService) {
    return new ConvergencesService();
  }
}());
