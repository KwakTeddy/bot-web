var FailedDialogsAnalysisController = require('../controllers/failed-dialogs-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/failed-dialogs', FailedDialogsAnalysisController.analysis);
};
