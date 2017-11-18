var dialogTrainingInput = require('../controllers/dialog-training-input-analysis.server.controller.js');

module.exports = function(app)
{
    app.route('/api/:botId/dialog-training-input-statistics').post(dialogTrainingInput.dialogTrainingInputStatistics);
};
