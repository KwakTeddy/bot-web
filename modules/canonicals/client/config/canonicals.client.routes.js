(function () {
  'use strict';

  angular
    .module('canonicals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('canonicals', {
        abstract: true,
        url: '/developer/canonicals',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('canonicals.list', {
        url: '',
        templateUrl: 'modules/canonicals/client/views/list-canonicals.client.view.html',
        controller: 'CanonicalsListController',
        controllerAs: 'vm',
        resolve: {
          canonicalsResolve: getCanonicals
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('canonicals.create', {
        url: '/create',
        templateUrl: 'modules/canonicals/client/views/form-canonical.client.view.html',
        controller: 'CanonicalsController',
        controllerAs: 'vm',
        resolve: {
          canonicalResolve: newCanonical
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('canonicals.edit', {
        url: '/:canonicalId/edit',
        templateUrl: 'modules/canonicals/client/views/form-canonical.client.view.html',
        controller: 'CanonicalsController',
        controllerAs: 'vm',
        resolve: {
          canonicalResolve: getCanonical
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ canonicalResolve.name }}'
        }
      })
      .state('canonicals.view', {
        url: '/:canonicalId',
        templateUrl: 'modules/canonicals/client/views/view-canonical.client.view.html',
        controller: 'CanonicalsController',
        controllerAs: 'vm',
        resolve: {
          canonicalResolve: getCanonical
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getCanonicals.$inject = ['CanonicalsService'];
  function getCanonicals(CanonicalsService) {
    return CanonicalsService.query().$promise;
  }

  getCanonical.$inject = ['$stateParams', 'CanonicalsService'];
  function getCanonical($stateParams, CanonicalsService) {
    return CanonicalsService.get({
      canonicalId: $stateParams.canonicalId
    }).$promise;
  }

  newCanonical.$inject = ['CanonicalsService'];
  function newCanonical(CanonicalsService) {
    return new CanonicalsService();
  }
})();
