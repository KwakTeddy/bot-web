var SummaryAnalysisController = require('../controllers/biz-summary-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/total-dialog-counts', SummaryAnalysisController.totalDialogCount);
    app.get('/api/:botId/analysis/total-dialog-content', SummaryAnalysisController.TotalDialogByPeriod);
    app.get('/api/:botId/analysis/last-send-date', SummaryAnalysisController.lastSendMsgDate);
    app.get('/api/:botId/analysis/total-succ-dialog-count', SummaryAnalysisController.totalSuccDialogCount);
    app.get('/api/:botId/:startDate/:endDate/:startTime/analysis/sendMsg', SummaryAnalysisController.getSendMsgsByBotId);

    app.get('/api/:botId/analysis/period-dialog-count', SummaryAnalysisController.periodDialogCount);
    app.get('/api/:botId/analysis/total-user-count', SummaryAnalysisController.totalUserCount);
    app.get('/api/:botId/analysis/period-user-count', SummaryAnalysisController.periodUserCount);
    app.get('/api/:botId/analysis/live-user-count', SummaryAnalysisController.liveUserCount);
    app.get('/api/:botId/analysis/daily-dialog-usage', SummaryAnalysisController.dailyDialogUsage);

    app.get('/api/:botId/analysis/user-input-statistics', SummaryAnalysisController.userInputStatistics);
    app.get('/api/:botId/analysis/fail-dialogs', SummaryAnalysisController.failDailogs);
    app.get('/api/:botId/analysis/scenario-usage', SummaryAnalysisController.scenarioUsage);
};
