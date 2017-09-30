//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .factory('DeliveryOrderMenusService', DeliveryOrderMenusService);

  DeliveryOrderMenusService.$inject = ['$resource'];

  function DeliveryOrderMenusService($resource) {
    return $resource('api/deliveryOrders/:deliveryOrderId/menus', {
      deliveryOrderId: '@deliveryOrder'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
