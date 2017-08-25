(function () {
  'use strict';

  angular
    .module('menu-navigations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('menu-navigations', {
        abstract: true,
        url: '/developer/menu-navigations',
        template: '<ui-view/>'
      })
      .state('menu-navigations.list', {
        url: '',
        templateUrl: 'modules/menu-navigations/client/views/list-menu-navigations.client.view.html',
        controller: 'MenuNavigationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Menu navigations List'
        }
      })
      .state('menu-navigations.create', {
        url: '/create',
        templateUrl: 'modules/menu-navigations/client/views/form-menu-navigation.client.view.html',
        controller: 'MenuNavigationsController',
        controllerAs: 'vm',
        resolve: {
          menuNavigationResolve: newMenuNavigation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Menu navigations Create'
        }
      })
      .state('menu-navigations.edit', {
        url: '/:menuNavigationId/edit',
        templateUrl: 'modules/menu-navigations/client/views/form-menu-navigation.client.view.html',
        controller: 'MenuNavigationsController',
        controllerAs: 'vm',
        resolve: {
          menuNavigationResolve: getMenuNavigation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Menu navigation {{ menu-navigationResolve.name }}'
        }
      })
      .state('menu-navigations.view', {
        url: '/:menuNavigationId',
        templateUrl: 'modules/menu-navigations/client/views/view-menu-navigation.client.view.html',
        controller: 'MenuNavigationsController',
        controllerAs: 'vm',
        resolve: {
          menuNavigationResolve: getMenuNavigation
        },
        data: {
          pageTitle: 'Menu navigation {{ menu-navigationResolve.name }}'
        }
      });
  }

  getMenuNavigation.$inject = ['$stateParams', 'MenuNavigationsService'];

  function getMenuNavigation($stateParams, MenuNavigationsService) {
    return MenuNavigationsService.get({
      menuNavigationId: $stateParams.menuNavigationId
    }).$promise;
  }

  newMenuNavigation.$inject = ['MenuNavigationsService'];

  function newMenuNavigation(MenuNavigationsService) {
    return new MenuNavigationsService();
  }
}());
