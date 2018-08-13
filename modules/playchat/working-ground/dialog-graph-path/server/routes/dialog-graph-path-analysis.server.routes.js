var DialogGraphPathAnalysisController = require('../controllers/dialog-graph-path-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/dialog-graph-path', DialogGraphPathAnalysisController.analysis);
};
