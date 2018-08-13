var DialogTrainingUsageController = require('../controller/dialog-training-usage.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/dialog-training-usage', DialogTrainingUsageController.analysis);
};
