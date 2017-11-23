var FailedDialogsAnalysisController = require('../controllers/failed-dialogs-analysis.server.controller.js');
var FailedDialogsOperationController = require('../controllers/failed-dialogs-operation.server.controller.js');
var FailedDialogTrainingController = require('../controllers/failed-dialog-training.server.controller.js');
var FailedDialogIntentController = require('../controllers/failed-dialog-intent.server.controller.js');
var FailedDialogGraphController = require('../controllers/failed-dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/failed-dialogs', FailedDialogsAnalysisController.analysis);

    app.get('/api/:botId/operation/failed-dialogs', FailedDialogsOperationController.analysis);
    app.put('/api/:botId/operation/failed-dialogs/:_id', FailedDialogsOperationController.clear);

    app.get('/api/:botId/operation/training/similiars', FailedDialogTrainingController.findSimiliars);
    app.post('/api/:botId/operation/training/save', FailedDialogTrainingController.create);

    app.get('/api/:botId/operation/failed-intent', FailedDialogIntentController.analysis);
    app.post('/api/:botId/operation/failed-intent/:intentId', FailedDialogIntentController.saveIntentContents);

    app.get('/api/:botId/operation/failed-graph', FailedDialogGraphController.analysis);
};
