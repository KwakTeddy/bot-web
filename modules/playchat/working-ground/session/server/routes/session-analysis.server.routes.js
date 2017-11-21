var SessionAnalysisController = require('../controllers/session-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/session-usage', SessionAnalysisController.sessionUsage);
}
