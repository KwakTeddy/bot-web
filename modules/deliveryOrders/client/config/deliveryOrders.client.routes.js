(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('deliveryOrders', {
        abstract: true,
        url: '/deliveryOrders',
        template: '<ui-view/>'
        // data: {
        //   roles: ['user', 'admin']
        // }
      })
      .state('deliveryOrders.list', {
        url: '',
        templateUrl: 'modules/deliveryOrders/client/views/list-deliveryOrders.client.view.html',
        controller: 'DeliveryOrdersListController',
        controllerAs: 'vm',
        resolve: {
          deliveryOrdersResolve: getDeliveryOrders
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('deliveryOrders.create', {
        url: '/create',
        templateUrl: 'modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html',
        controller: 'DeliveryOrdersController',
        controllerAs: 'vm',
        resolve: {
          deliveryOrderResolve: newDeliveryOrder
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('deliveryOrders.menus', {
        url: '/:deliveryOrderId/menus',
        // url: '/menus',
        templateUrl: 'modules/deliveryOrders/client/views/form-deliveryOrderMenu.client.view.html',
        controller: 'DeliveryOrderMenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: getDeliveryOrderMenu
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('deliveryOrders.edit', {
        url: '/:deliveryOrderId/edit',
        templateUrl: 'modules/deliveryOrders/client/views/form-deliveryOrder.client.view.html',
        controller: 'DeliveryOrdersController',
        controllerAs: 'vm',
        resolve: {
          deliveryOrderResolve: getDeliveryOrder
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ deliveryOrderResolve.name }}'
        }
      })
      .state('deliveryOrders.view', {
        url: '/:deliveryOrderId',
        templateUrl: 'modules/deliveryOrders/client/views/view-deliveryOrder.client.view.html',
        controller: 'DeliveryOrdersController',
        controllerAs: 'vm',
        resolve: {
          deliveryOrderResolve: getDeliveryOrder
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getDeliveryOrders.$inject = ['DeliveryOrdersService'];
  function getDeliveryOrders(DeliveryOrdersService) {
    return DeliveryOrdersService.query().$promise;
  }

  getDeliveryOrder.$inject = ['$stateParams', 'DeliveryOrdersService'];
  function getDeliveryOrder($stateParams, DeliveryOrdersService) {
    return DeliveryOrdersService.get({
      deliveryOrderId: $stateParams.deliveryOrderId
    }).$promise;
  }

  newDeliveryOrder.$inject = ['DeliveryOrdersService'];
  function newDeliveryOrder(DeliveryOrdersService) {
    return new DeliveryOrdersService();
  }

  newDeliveryOrderMenu.$inject = ['DeliveryOrderMenusService'];
  function newDeliveryOrderMenu(DeliveryOrderMenusService) {
    return new DeliveryOrderMenusService();
  }

  getDeliveryOrderMenu.$inject = ['$stateParams', 'DeliveryOrderMenusService'];
  function getDeliveryOrderMenu($stateParams, DeliveryOrderMenusService) {
    return DeliveryOrderMenusService.get({
      deliveryOrderId: $stateParams.deliveryOrderId
    }).$promise;
  }

})();
