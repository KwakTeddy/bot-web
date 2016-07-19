(function () {
  'use strict';

  angular
    .module('facts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('facts', {
        abstract: true,
        url: '/facts',
        template: '<ui-view/>'
      })
      .state('facts.list', {
        url: '',
        templateUrl: 'modules/facts/client/views/list-facts.client.view.html',
        controller: 'FactsListController',
        controllerAs: 'vm',
        resolve: {
          factsResolve: getFacts
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('facts.create', {
        url: '/create',
        templateUrl: 'modules/facts/client/views/form-fact.client.view.html',
        controller: 'FactsController',
        controllerAs: 'vm',
        resolve: {
          factResolve: newFact
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('facts.edit', {
        url: '/:factId/edit',
        templateUrl: 'modules/facts/client/views/form-fact.client.view.html',
        controller: 'FactsController',
        controllerAs: 'vm',
        resolve: {
          factResolve: getFact
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ factResolve.name }}'
        }
      })
      .state('facts.view', {
        url: '/:factId',
        templateUrl: 'modules/facts/client/views/view-fact.client.view.html',
        controller: 'FactsController',
        controllerAs: 'vm',
        resolve: {
          factResolve: getFact
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getFacts.$inject = ['FactsService'];
  function getFacts(FactsService) {
    return FactsService.query().$promise;
  }

  getFact.$inject = ['$stateParams', 'FactsService'];
  function getFact($stateParams, FactsService) {
    return FactsService.get({
      factId: $stateParams.factId
    }).$promise;
  }

  newFact.$inject = ['FactsService'];
  function newFact(FactsService) {
    return new FactsService();
  }
})();
