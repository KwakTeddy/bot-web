var CSCommonController = require('../controllers/biz-cs-common.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/total-dialog-counts', CSCommonController.totalDialogCount);
    app.get('/api/:botId/analysis/total-dialog-content', CSCommonController.TotalDialogByPeriod);
    app.get('/api/:botId/analysis/last-send-date', CSCommonController.lastSendMsgDate);
    app.get('/api/:botId/analysis/total-succ-dialog-count', CSCommonController.totalSuccDialogCount);
    app.get('/api/:botId/:startDate/:endDate/:startTime/analysis/sendMsg', CSCommonController.getSendMsgsByBotId);

    app.get('/api/:botId/analysis/period-dialog-count', CSCommonController.periodDialogCount);
    app.get('/api/:botId/analysis/total-user-count', CSCommonController.totalUserCount);
    app.get('/api/:botId/analysis/period-user-count', CSCommonController.periodUserCount);
    app.get('/api/:botId/analysis/live-user-count', CSCommonController.liveUserCount);
    app.get('/api/:botId/analysis/daily-dialog-usage', CSCommonController.dailyDialogUsage);

    app.get('/api/:botId/analysis/user-input-statistics', CSCommonController.userInputStatistics);
    app.get('/api/:botId/analysis/fail-dialogs', CSCommonController.failDailogs);
    app.get('/api/:botId/analysis/scenario-usage', CSCommonController.scenarioUsage);
};
