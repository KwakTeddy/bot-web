var dialogsets = require('../controllers/dialog-set.server.controller');

module.exports = function(app)
{
    app.post('/api/dialogsets/uploadfile', dialogsets.uploadFile);
    app.put('/api/dialogsets/:botId/usable', dialogsets.updateUsable);
    app.get('/api/dialogsets/:botId/totalpage', dialogsets.findTotalPage);
    app.get('/api/dialogsets/:botId/findbytitle', dialogsets.findDialogsetByTitle);
    app.route('/api/dialogsets/:botId').get(dialogsets.find).post(dialogsets.create).put(dialogsets.update).delete(dialogsets.delete);

    // app.route('/api/dialogsets/:dialogsetId').get(dialogsets.read).put(dialogsets.update).delete(dialogsets.delete);
    //
    // app.route('/api/dialogsets/convert').post(dialogsets.convertFile);
    //
    // app.route('/api/dialogsets/:dialogsetId/dialogs').get(dialogsetDialogs.list).post(dialogsetDialogs.create);
    //
    // app.route('/api/dialogsets/:dialogsetId/dialogs/:dialogsetDialogId').get(dialogsetDialogs.read).put(dialogsetDialogs.update).delete(dialogsetDialogs.delete);
    //
    // app.route('/api/conceptlist').get(dialogsetDialogs.concepts);
    //
    // app.route('/api/lgfaq').get(dialogsetDialogs.lgfaq);
    //
    // app.route('/api/generalconcepts').get(concept.getConcepts);
    //
    // app.param('dialogsetId', dialogsets.dialogsetByID);
    // app.param('dialogsetDialogId', dialogsetDialogs.dialogsetDialogByID);
};
