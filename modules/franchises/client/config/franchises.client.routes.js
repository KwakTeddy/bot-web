(function () {
  'use strict';

  angular
    .module('franchises')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('franchises', {
        abstract: true,
        url: '/developer/franchises',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('franchises.list', {
        url: '',
        templateUrl: 'modules/franchises/client/views/list-franchises.client.view.html',
        controller: 'FranchisesListController',
        controllerAs: 'vm',
        resolve: {
          franchisesResolve: getFranchises
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('franchises.create', {
        url: '/create',
        templateUrl: 'modules/franchises/client/views/form-franchise.client.view.html',
        controller: 'FranchisesController',
        controllerAs: 'vm',
        resolve: {
          franchiseResolve: newFranchise
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('franchises.menus', {
        url: '/:franchiseId/menus',
        // url: '/menus',
        templateUrl: 'modules/franchises/client/views/form-franchiseMenu.client.view.html',
        controller: 'FranchiseMenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: getFranchiseMenu
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('franchises.edit', {
        url: '/:franchiseId/edit',
        templateUrl: 'modules/franchises/client/views/form-franchise.client.view.html',
        controller: 'FranchisesController',
        controllerAs: 'vm',
        resolve: {
          franchiseResolve: getFranchise
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ franchiseResolve.name }}'
        }
      })
      .state('franchises.view', {
        url: '/:franchiseId',
        templateUrl: 'modules/franchises/client/views/view-franchise.client.view.html',
        controller: 'FranchisesController',
        controllerAs: 'vm',
        resolve: {
          franchiseResolve: getFranchise
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getFranchises.$inject = ['FranchisesService'];
  function getFranchises(FranchisesService) {
    return FranchisesService.query().$promise;
  }

  getFranchise.$inject = ['$stateParams', 'FranchisesService'];
  function getFranchise($stateParams, FranchisesService) {
    return FranchisesService.get({
      franchiseId: $stateParams.franchiseId
    }).$promise;
  }

  newFranchise.$inject = ['FranchisesService'];
  function newFranchise(FranchisesService) {
    return new FranchisesService();
  }

  newFranchiseMenu.$inject = ['FranchiseMenusService'];
  function newFranchiseMenu(FranchiseMenusService) {
    return new FranchiseMenusService();
  }

  getFranchiseMenu.$inject = ['$stateParams', 'FranchiseMenusService'];
  function getFranchiseMenu($stateParams, FranchiseMenusService) {
    return FranchiseMenusService.get({
      franchiseId: $stateParams.franchiseId
    }).$promise;
  }

})();
