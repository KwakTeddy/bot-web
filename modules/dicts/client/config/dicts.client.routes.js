(function () {
  'use strict';

  angular
    .module('dicts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dicts', {
        abstract: true,
        url: '/developer/dicts',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dicts.list', {
        url: '',
        templateUrl: 'modules/dicts/client/views/list-dicts.client.view.html',
        controller: 'DictsListController',
        controllerAs: 'vm',
        resolve: {
          dictsResolve: getDicts
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('dicts.create', {
        url: '/create',
        templateUrl: 'modules/dicts/client/views/form-dict.client.view.html',
        controller: 'DictsController',
        controllerAs: 'vm',
        resolve: {
          dictResolve: newDict
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('dicts.edit', {
        url: '/:dictId/edit',
        templateUrl: 'modules/dicts/client/views/form-dict.client.view.html',
        controller: 'DictsController',
        controllerAs: 'vm',
        resolve: {
          dictResolve: getDict
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ dictResolve.name }}'
        }
      })
      .state('dicts.view', {
        url: '/:dictId',
        templateUrl: 'modules/dicts/client/views/view-dict.client.view.html',
        controller: 'DictsController',
        controllerAs: 'vm',
        resolve: {
          dictResolve: getDict
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getDicts.$inject = ['DictsService'];
  function getDicts(DictsService) {
    return DictsService.query().$promise;
  }

  getDict.$inject = ['$stateParams', 'DictsService'];
  function getDict($stateParams, DictsService) {
    return DictsService.get({
      dictId: $stateParams.dictId
    }).$promise;
  }

  newDict.$inject = ['DictsService'];
  function newDict(DictsService) {
    return new DictsService();
  }
})();
