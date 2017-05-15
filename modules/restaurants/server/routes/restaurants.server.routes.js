'use strict';

/**
 * Module dependencies
 */
var restaurantsPolicy = require('../policies/restaurants.server.policy'),
  restaurants = require('../controllers/restaurants.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/restaurants')//all(restaurantsPolicy.isAllowed)
    .get(restaurants.list)
    .post(restaurants.create);

  app.route('/api/restaurants/:restaurantId')//all(restaurantsPolicy.isAllowed)
    .get(restaurants.read)
    .put(restaurants.update)
    .delete(restaurants.delete);

  app.route('/api/restaurants/:restaurantId/menus')//all(restaurantsPolicy.isAllowed)
    .get(restaurants.readMenus)
    .put(restaurants.updateMenus);

  // Finish by binding the Custom action middleware
  app.param('restaurantId', restaurants.restaurantByID);
};
