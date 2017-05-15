'use strict';

/**
 * Module dependencies
 */
var franchisesPolicy = require('../policies/franchises.server.policy'),
  franchises = require('../controllers/franchises.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/franchises')//all(franchisesPolicy.isAllowed)
    .get(franchises.list)
    .post(franchises.create);

  app.route('/api/franchises/:franchiseId')//all(franchisesPolicy.isAllowed)
    .get(franchises.read)
    .put(franchises.update)
    .delete(franchises.delete);

  app.route('/api/franchises/:franchiseId/menus')//all(franchisesPolicy.isAllowed)
    .get(franchises.readMenus)
    .put(franchises.updateMenus);

  // Finish by binding the Custom action middleware
  app.param('franchiseId', franchises.franchiseByID);
};
