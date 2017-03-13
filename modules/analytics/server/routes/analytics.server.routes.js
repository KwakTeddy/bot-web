'use strict';

/**
 * Module dependencies
 */
var analyticsPolicy = require('../policies/analytics.server.policy'),
  analytics = require('../controllers/analytics.server.controller');

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/user-count/:kind/:arg').all(analyticsPolicy.isAllowed)
    .get(analytics.list);

  app.route('/api/dialog-usage/:kind/:arg').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogList);

  app.route('/api/dialog-success/:kind/:arg').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogSuccessList);

  app.route('/api/session-success/:kind/:arg').all(analyticsPolicy.isAllowed)
    .get(analytics.sessionSuccessList);

  app.route('/api/dialog-failure/:kind/:arg').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureList);

  // Finish by binding the Bot user middleware
  app.param('botUserId', analytics.botUserByID);
};
