'use strict';

/**
 * Module dependencies.
 */
var learningsPolicy = require('../policies/learnings.server.policy'),
  learnings = require('../controllers/learnings.server.controller');

module.exports = function (app) {
  // Learnings collection routes
  app.route('/api/learnings')//all(learningsPolicy.isAllowed)
    .get(learnings.list)
    .post(learnings.create);

  // Single learning routes
  app.route('/api/learnings/:learningId')//all(learningsPolicy.isAllowed)
    .get(learnings.read)
    .put(learnings.update)
    .delete(learnings.delete);

  // Finish by binding the learning middleware
  app.param('learningId', learnings.learningByID);
};
