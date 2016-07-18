'use strict';

/**
 * Module dependencies
 */
var canonicalsPolicy = require('../policies/canonicals.server.policy'),
  canonicals = require('../controllers/canonicals.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/canonicals')//.all(canonicalsPolicy.isAllowed)
    .get(canonicals.list)
    .post(canonicals.create);

  app.route('/api/canonicals/:canonicalId')//.all(canonicalsPolicy.isAllowed)
    .get(canonicals.read)
    .put(canonicals.update)
    .delete(canonicals.delete);

  // Finish by binding the Custom action middleware
  app.param('canonicalId', canonicals.canonicalByID);
};
