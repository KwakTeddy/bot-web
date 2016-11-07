'use strict';

/**
 * Module dependencies
 */
var deliveryOrdersPolicy = require('../policies/deliveryOrders.server.policy'),
  deliveryOrders = require('../controllers/deliveryOrders.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/deliveryOrders')//.all(deliveryOrdersPolicy.isAllowed)
    .get(deliveryOrders.list)
    .post(deliveryOrders.create);

  app.route('/api/deliveryOrders/:deliveryOrderId')//.all(deliveryOrdersPolicy.isAllowed)
    .get(deliveryOrders.read)
    .put(deliveryOrders.update)
    .delete(deliveryOrders.delete);

  app.route('/api/deliveryOrders/:deliveryOrderId/menus')//.all(deliveryOrdersPolicy.isAllowed)
    .get(deliveryOrders.readMenus)
    .put(deliveryOrders.updateMenus);

  // Finish by binding the Custom action middleware
  app.param('deliveryOrderId', deliveryOrders.deliveryOrderByID);

  app.route('/terms')
    .get(deliveryOrders.linkTerms);

};
