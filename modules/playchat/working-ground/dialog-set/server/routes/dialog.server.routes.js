var dialog = require('../controllers/dialog.server.controller.js');

module.exports = function(app)
{
    app.get('/api/dialogs/:dialogsetId/totalpage', dialog.findTotalPage);
    app.get('/api/dialogs/:dialogsetId', dialog.find);
    app.post('/api/dialogs/:dialogsetId', dialog.create);
};
