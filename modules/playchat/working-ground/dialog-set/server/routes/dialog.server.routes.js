var dialog = require('../controllers/dialog.server.controller.js');

module.exports = function(app)
{
    app.get('/api/dialogsets/:dialogsetId/dialogs/totalpage', dialog.findTotalPage);
    app.get('/api/dialogsets/:dialogsetId/dialogs', dialog.find);
    app.post('/api/dialogsets/:dialogsetId/dialogs', dialog.create);
    app.put('/api/dialogsets/:dialogsetId/dialogs', dialog.update);
    app.delete('/api/dialogsets/:dialogsetId/dialogs/:dialogsId', dialog.delete);
};
