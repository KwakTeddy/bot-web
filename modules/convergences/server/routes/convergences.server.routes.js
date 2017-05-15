'use strict';

/**
 * Module dependencies
 */
var convergencesPolicy = require('../policies/convergences.server.policy'),
  convergences = require('../controllers/convergences.server.controller');

module.exports = function(app) {
  // Convergences Routes
  app.route('/api/convergences')//all(convergencesPolicy.isAllowed)
    .get(convergences.list)
    .post(convergences.create);

  app.route('/api/convergences/:convergenceId')//all(convergencesPolicy.isAllowed)
    .get(convergences.read)
    .put(convergences.update)
    .delete(convergences.delete);

  // Finish by binding the Convergence middleware
  app.param('convergenceId', convergences.convergenceByID);
};
