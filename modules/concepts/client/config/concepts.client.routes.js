(function () {
  'use strict';

  angular
    .module('concepts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('concepts', {
        abstract: true,
        url: '/developer/concepts',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('concepts.list', {
        url: '',
        templateUrl: 'modules/concepts/client/views/list-concepts.client.view.html',
        controller: 'ConceptsListController',
        controllerAs: 'vm',
        resolve: {
          conceptsResolve: getConcepts
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('concepts.create', {
        url: '/create',
        templateUrl: 'modules/concepts/client/views/form-concept.client.view.html',
        controller: 'ConceptsController',
        controllerAs: 'vm',
        resolve: {
          conceptResolve: newConcept
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('concepts.edit', {
        url: '/:conceptId/edit',
        templateUrl: 'modules/concepts/client/views/form-concept.client.view.html',
        controller: 'ConceptsController',
        controllerAs: 'vm',
        resolve: {
          conceptResolve: getConcept
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ conceptResolve.name }}'
        }
      })
      .state('concepts.view', {
        url: '/:conceptId',
        templateUrl: 'modules/concepts/client/views/view-concept.client.view.html',
        controller: 'ConceptsController',
        controllerAs: 'vm',
        resolve: {
          conceptResolve: getConcept
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getConcepts.$inject = ['ConceptsService'];
  function getConcepts(ConceptsService) {
    return ConceptsService.query().$promise;
  }

  getConcept.$inject = ['$stateParams', 'ConceptsService'];
  function getConcept($stateParams, ConceptsService) {
    return ConceptsService.get({
      conceptId: $stateParams.conceptId
    }).$promise;
  }

  newConcept.$inject = ['ConceptsService'];
  function newConcept(ConceptsService) {
    return new ConceptsService();
  }
})();
