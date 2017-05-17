'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  analyticsPolicy = require('../policies/analytics.server.policy'),
  analytics = require('../controllers/analytics.server.controller'),
  autoCorrection = require(path.resolve('modules/bot/engine/nlp/autoCorrection')),
  intent = require(path.resolve('modules/bot/engine/nlu/intent'));

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/user-count/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.list);

  app.route('/api/dialog-usage/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogList);

  app.route('/api/dialog-success/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogSuccessList);

  app.route('/api/session-success/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.sessionSuccessList);

  app.route('/api/dialog-failure/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureList);

  app.route('/api/dialog/:bId/:dialogId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialog)
    .put(analytics.save_dialog);

  app.route('/api/saveDialog/:bId/:fileName')//all(analyticsPolicy.isAllowed)
    .put(analytics.save_dialogs);

  app.route('/api/loadBot/:bId')//all(analyticsPolicy.isAllowed)
    .get(analytics.load_bot);

  app.route('/api/dialogs/:bId/:fileId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogs);

  app.route('/api/dialoginfos/:bId/:fileId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialoginfos);

  app.route('/api/resetDB')//all(analyticsPolicy.isAllowed)
    .delete(analytics.resetDB);

  app.route('/api/batchCorrection')//all(analyticsPolicy.isAllowed)
    .get(function(req, res) {autoCorrection.batchCorrectionDB()});

  app.route('/api/dialogchildren/:bId/:dialogId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogChildren);

  app.route('/api/intent/analyzeFailIntent/:bId')//all(analyticsPolicy.isAllowed)
    .get(intent.analyzeIntentFailReq);

  app.route('/api/dialog-failure-maintenance/:botNameId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureMaintenanceList);

  app.route('/api/dialog-failure-maintenance/:botNameId/:intentId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureMaintenance)
    .put(analytics.dialogFailureMaintenanceUpdate);

};
