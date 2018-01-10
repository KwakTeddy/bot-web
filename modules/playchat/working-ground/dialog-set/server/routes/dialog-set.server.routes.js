var dialogsets = require('../controllers/dialog-set.server.controller');

module.exports = function(app)
{
    app.post('/api/dialogsets/uploadfile', dialogsets.uploadFile);
    app.put('/api/:botId/dialogsets/usable', dialogsets.updateUsable);
    app.get('/api/:botId/dialogsets/totalpage', dialogsets.findTotalPage);
    app.get('/api/:botId/dialogsets/findbytitle', dialogsets.findDialogsetByTitle);

    app.get('/api/:botId/dialogsets', dialogsets.find);
    app.get('/api/:botId/dialogsets/:dialogsetId', dialogsets.findOne);
    app.post('/api/:botId/dialogsets', dialogsets.create);
    app.put('/api/:botId/dialogsets', dialogsets.update);
    app.delete('/api/:botId/dialogsets/:dialogsetId', dialogsets.delete);
};
