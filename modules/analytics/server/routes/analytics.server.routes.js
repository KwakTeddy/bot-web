'use strict';

/**
 * Module dependencies
 */
var analyticsPolicy = require('../policies/analytics.server.policy'),
  analytics = require('../controllers/analytics.server.controller');

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/user-count').all(analyticsPolicy.isAllowed)
    .get(analytics.list);

  app.route('/api/dialog-usage').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogList);

  app.route('/api/dialog-success').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogSuccessList);

  app.route('/api/session-success').all(analyticsPolicy.isAllowed)
    .get(analytics.sessionSuccessList);

  app.route('/api/dialog-failure').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureList);

  // Finish by binding the Bot user middleware
  app.param('botUserId', analytics.botUserByID);
};
