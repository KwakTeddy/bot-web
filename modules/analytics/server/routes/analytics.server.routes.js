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

  app.route('/api/dialog/:bId/:dialogId').all(analyticsPolicy.isAllowed)
    .get(analytics.dialog)
    .put(analytics.save_dialog);

  app.route('/api/saveDialog/:bId/:fileName').all(analyticsPolicy.isAllowed)
    .put(analytics.save_dialogs);

  app.route('/api/dialogs/:bId/:fileId').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogs);

  app.route('/api/resetDB').all(analyticsPolicy.isAllowed)
    .delete(analytics.resetDB);

  app.route('/api/dialogchildren/:bId/:dialogId').all(analyticsPolicy.isAllowed)
    .get(analytics.dialogChildren);

};
