var DialogGraphUsageController = require('../controllers/dialog-graph-usage.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/dialog-graph-usage', DialogGraphUsageController.dialogGraphUsage);
};
