var failedDialogTraining = require('../controllers/failed-dialog-training.server.controller');
var failedIntent = require('../controllers/failed-intent.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/operation/faileddialogs', failedDialogTraining.find);

    app.get('/api/:botId/operation/failedintents', failedIntent.find);
};
