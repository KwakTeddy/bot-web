var SummaryAnalysisController = require('../controllers/summary-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/total-dialog-count', SummaryAnalysisController.totalDialogCount);
    app.get('/api/:botId/analysis/period-dialog-count', SummaryAnalysisController.periodDialogCount);
    app.get('/api/:botId/analysis/total-user-count', SummaryAnalysisController.totalUserCount);
    app.get('/api/:botId/analysis/period-user-count', SummaryAnalysisController.periodUserCount);
    app.get('/api/:botId/analysis/live-user-count', SummaryAnalysisController.periodUserCount);
    app.get('/api/:botId/analysis/daily-dialog-usage', SummaryAnalysisController.dailyDialogUsage);

    app.get('/api/:botId/analysis/user-input-statistics', SummaryAnalysisController.userInputStatistics);
    app.get('/api/:botId/analysis/fail-dialogs', SummaryAnalysisController.failDailogs);
    app.get('/api/:botId/analysis/scenario-usage', SummaryAnalysisController.scenarioUsage);
};
