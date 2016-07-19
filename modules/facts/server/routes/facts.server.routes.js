'use strict';

/**
 * Module dependencies
 */
var factsPolicy = require('../policies/facts.server.policy'),
  facts = require('../controllers/facts.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/facts')//.all(factsPolicy.isAllowed)
    .get(facts.list)
    .post(facts.create);

  app.route('/api/facts/:factId')//.all(factsPolicy.isAllowed)
    .get(facts.read)
    .put(facts.update)
    .delete(facts.delete);

  // Finish by binding the Custom action middleware
  app.param('factId', facts.factByID);
};
