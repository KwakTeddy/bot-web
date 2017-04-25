(function () {
  'use strict';

  angular
    .module('entitys')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('entitys', {
        abstract: true,
        url: '/developer/entitys',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('entitys.list', {
        url: '',
        templateUrl: 'modules/entitys/client/views/list-entitys.client.view.html',
        controller: 'EntitysListController',
        controllerAs: 'vm',
        resolve: {
          entitysResolve: getEntitys
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('entitys.create', {
        url: '/create',
        templateUrl: 'modules/entitys/client/views/form-entity.client.view.html',
        controller: 'EntitysController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: newEntity
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('entitys.edit', {
        url: '/:entityId/edit',
        templateUrl: 'modules/entitys/client/views/form-entity.client.view.html',
        controller: 'EntitysController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: getEntity
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ entityResolve.name }}'
        }
      })
      .state('entitys.view', {
        url: '/:entityId',
        templateUrl: 'modules/entitys/client/views/view-entity.client.view.html',
        controller: 'EntitysController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: getEntity
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getEntitys.$inject = ['EntitysService'];
  function getEntitys(EntitysService) {
    return EntitysService.query().$promise;
  }

  getEntity.$inject = ['$stateParams', 'EntitysService'];
  function getEntity($stateParams, EntitysService) {
    return EntitysService.get({
      entityId: $stateParams.entityId
    }).$promise;
  }

  newEntity.$inject = ['EntitysService'];
  function newEntity(EntitysService) {
    return new EntitysService();
  }
})();
