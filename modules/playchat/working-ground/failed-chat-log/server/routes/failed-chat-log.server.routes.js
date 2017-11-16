var failedDialogTraining = require('../controllers/failed-dialog-training.server.controller');

module.exports = function(app)
{
    app.get('/api/:botId/operation/faileddialogs', failedDialogTraining.find);
};
