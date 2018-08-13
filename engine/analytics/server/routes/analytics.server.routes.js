'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  analyticsPolicy = require('../policies/analytics.server.policy'),
  analytics = require('../controllers/analytics.server.controller'),
  autoCorrection = require(path.resolve('engine/bot/engine/nlp/autoCorrection')),
  intent = require(path.resolve('engine/bot/engine/nlu/intent'));

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/user-count/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.list);

  app.route('/api/user-input-statistics/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userInputStatistics);

  app.route('/api/userCount/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userCount);

  app.route('/api/senarioUsage/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.senarioUsage);

  app.route('/api/failDailogs/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.failDailogs);

 app.route('/api/userDialogCumulativeCount/:bId')//all(analyticsPolicy.isAllowed)
    .get(analytics.userDialogCumulativeCount);

  app.route('/api/daily-dialog-usage')//all(analyticsPolicy.isAllowed)
    .post(analytics.dailyDialogUsage);

  app.route('/api/fail-dialog-statistics/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.failDialogStatistics);

  app.route('/api/dialog-isFail/:bId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogIsFail);

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

  app.route('/api/loadBot/:bId/:fileName')//all(analyticsPolicy.isAllowed)
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

  app.route('/api/analytics/statistics/exel-download/:bId')
    .post(analytics.exelDownload);

  app.route('/api/analytics/statistics/senario/exel-download/:bId')
    .post(analytics.senarioExelDownload)

  app.route('/api/user-input-statistics-faq/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userInputStatisticsFaq);
};
