//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('deliveryOrders')
    .factory('DeliveryOrdersService', DeliveryOrdersService);

  DeliveryOrdersService.$inject = ['$resource'];

  function DeliveryOrdersService($resource) {
    return $resource('api/deliveryOrders/:deliveryOrderId', {
      deliveryOrderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
