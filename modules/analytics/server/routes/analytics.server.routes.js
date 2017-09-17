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
  // 장원준 서버 라우팅
  app.route('/api/user-count/:bId/:kind/:arg')//all(analyticsPolicy.isAllowed)
    .get(analytics.list);

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

  //박준하 통계 라우팅
  //실패 인텐트 리스트
  app.route('/api/dialog-failure-maintenance/:botNameId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureMaintenanceList);
  //실패 인텐트 학습 상세
  app.route('/api/dialog-failure-maintenance/:botNameId/:intentId')//all(analyticsPolicy.isAllowed)
    .get(analytics.dialogFailureMaintenance)
    .put(analytics.dialogFailureMaintenanceUpdate);
  //사용자 입력 통계
  app.route('/api/user-input-statistics/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userInputStatistics);
  // 사용자 통계
  app.route('/api/userCount/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userCount);
  //시나리오 통계
  app.route('/api/senarioUsage/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.senarioUsage);
  //실패 대화 -대쉬보드용
  app.route('/api/failDailogs/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.failDailogs);
  //누적 대화량 통계
  app.route('/api/userDialogCumulativeCount/:bId')//all(analyticsPolicy.isAllowed)
    .get(analytics.userDialogCumulativeCount);
  //일별 사용 대화량 통계
  app.route('/api/daily-dialog-usage')//all(analyticsPolicy.isAllowed)
    .post(analytics.dailyDialogUsage);
  //실패 대화 통계
  app.route('/api/fail-dialog-statistics/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.failDialogStatistics);
  //엑셀 다운로드
  app.route('/api/analytics/statistics/exel-download/:bId')
    .post(analytics.exelDownload);
  //시나리오 엑셀 다운로드
  app.route('/api/analytics/statistics/senario/exel-download/:bId')
    .post(analytics.senarioExelDownload);
  //신한카드 전용 api
  app.route('/api/user-input-statistics-faq/:bId')//all(analyticsPolicy.isAllowed)
    .post(analytics.userInputStatisticsFaq);

};
