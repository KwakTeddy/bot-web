var SendlistAnalysisController = require('../controllers/biz-sendlist-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/total-dialog-count', SendlistAnalysisController.totalDialogCount);
    app.get('/api/:botId/analysis/period-dialog-count', SendlistAnalysisController.periodDialogCount);
    app.get('/api/:botId/analysis/total-user-count', SendlistAnalysisController.totalUserCount);
    app.get('/api/:botId/analysis/period-user-count', SendlistAnalysisController.periodUserCount);
    app.get('/api/:botId/analysis/live-user-count', SendlistAnalysisController.liveUserCount);
    app.get('/api/:botId/analysis/daily-dialog-usage', SendlistAnalysisController.dailyDialogUsage);

    app.get('/api/:botId/analysis/user-input-statistics', SendlistAnalysisController.userInputStatistics);
    app.get('/api/:botId/analysis/fail-dialogs', SendlistAnalysisController.failDailogs);
    app.get('/api/:botId/analysis/scenario-usage', SendlistAnalysisController.scenarioUsage);
};
