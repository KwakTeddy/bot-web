var DialogTrainingInputController = require('../controllers/dialog-training-input-analysis.server.controller.js');

module.exports = function(app)
{
    app.route('/api/:botId/analysis/dialog-training-input').get(DialogTrainingInputController.analysis);
};
