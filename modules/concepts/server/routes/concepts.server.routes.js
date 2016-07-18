'use strict';

/**
 * Module dependencies
 */
var conceptsPolicy = require('../policies/concepts.server.policy'),
  concepts = require('../controllers/concepts.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/concepts')//.all(conceptsPolicy.isAllowed)
    .get(concepts.list)
    .post(concepts.create);

  app.route('/api/concepts/:conceptId')//.all(conceptsPolicy.isAllowed)
    .get(concepts.read)
    .put(concepts.update)
    .delete(concepts.delete);

  // Finish by binding the Custom action middleware
  app.param('conceptId', concepts.conceptByID);
};
