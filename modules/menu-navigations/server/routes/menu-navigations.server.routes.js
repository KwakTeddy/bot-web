'use strict';

/**
 * Module dependencies
 */
var menuNavigationsPolicy = require('../policies/menu-navigations.server.policy'),
  menuNavigations = require('../controllers/menu-navigations.server.controller');

module.exports = function(app) {
  // Menu navigations Routes
  app.route('/api/menu-navigations').all(menuNavigationsPolicy.isAllowed)
    .get(menuNavigations.list)
    .post(menuNavigations.create);

  app.route('/api/menu-navigations/:menuNavigationId').all(menuNavigationsPolicy.isAllowed)
    .get(menuNavigations.read)
    .put(menuNavigations.update)
    .delete(menuNavigations.delete);

  // Finish by binding the Menu navigation middleware
  app.param('menuNavigationId', menuNavigations.menuNavigationByID);
};
