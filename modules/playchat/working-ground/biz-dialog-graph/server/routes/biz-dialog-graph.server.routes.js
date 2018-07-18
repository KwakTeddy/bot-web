var dialoggraphs = require('../controllers/biz-dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/biz-dialog-graphs/:fileName/exist', dialoggraphs.checkFile);
    app.get('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.findFile);
    app.get('/api/:botId/biz-dialog-graphs', dialoggraphs.find);
    app.get('/api/:botId/biz-graphfiles/:fileName', dialoggraphs.getGraphFile);

    app.get('/api/:botId/biz-msg',dialoggraphs.getBizMsg);
    app.post('/api/:botId/biz-msg/:id',dialoggraphs.editBizMsg);

    app.get('/api/:bizchatId/biz-sentences', dialoggraphs.getSentences);

    app.post('/api/script/:type/:name', dialoggraphs.editScript);
    app.get('/api/script/:type', dialoggraphs.getScript);

    app.post('/api/:botId/biz-dialog-graphs/uploadImage', dialoggraphs.uploadImage);
    app.post('/api/:botId/biz-dialog-graphs/uploadFile', dialoggraphs.uploadFile);
    app.post('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.saveFile);
    app.delete('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.deleteFile);
    app.get('/api/:botId/biz-dialog-graphs/nlp/:text', dialoggraphs.getNlp);
    app.get('/api/template/:templateId', dialoggraphs.getDefaultTemplate);
};
