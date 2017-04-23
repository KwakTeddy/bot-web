(function () {
  'use strict';

  angular
    .module('entities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('entities', {
        abstract: true,
        url: '/developer/entities',
        template: '<ui-view/>'
      })
      .state('entities.list', {
        url: '',
        templateUrl: 'modules/entities/client/views/list-entities.client.view.html',
        controller: 'EntitiesListController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: newEntity
        },
        data: {
          pageTitle: 'Entities List'
        }
      })
      .state('entities.create', {
        url: '/create',
        templateUrl: 'modules/entities/client/views/form-entity.client.view.html',
        controller: 'EntitiesController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: newEntity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Entities Create'
        }
      })
      .state('entities.edit', {
        url: '/:entityId/edit',
        templateUrl: 'modules/entities/client/views/form-entity.client.view.html',
        controller: 'EntitiesController',
        controllerAs: 'vm',
        resolve: {
          entityResolve: getEntity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Entity {{ entityResolve.name }}'
        }
      })
      .state('entities.view', {
        url: '/:entityId',
        templateUrl: 'modules/entities/client/views/view-entity.client.view.html',
        controller: 'EntitiesController',
        controllerAs: 'vm',
        resolve: {
          // entityResolve: getEntity,
          entityContentsResolve: getEntityContent
        },
        data: {
          pageTitle: 'Entity {{ entityResolve.name }}'
        }
      });
  }

  getEntity.$inject = ['$stateParams', 'EntitiesService'];

  function getEntity($stateParams, EntitiesService) {
    // console.log(EntitiesService.get({
    //   entityId: $stateParams.entityId
    // }).$promise);
    return EntitiesService.get({
      entityId: $stateParams.entityId
    }).$promise;
  }

  getEntityContent.$inject = ['$stateParams', 'EntityContentsService'];

  function getEntityContent($stateParams, EntityContentsService) {
    console.log(EntityContentsService.query({
      entityId: $stateParams.entityId
    }).$promise);
    return EntityContentsService.query({
      entityId: $stateParams.entityId
    }).$promise;
  }

  newEntity.$inject = ['EntitiesService'];

  function newEntity(EntitiesService) {
    return new EntitiesService();
  }
}());
