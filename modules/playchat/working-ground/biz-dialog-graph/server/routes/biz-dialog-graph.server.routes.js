var dialoggraphs = require('../controllers/biz-dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/biz-dialog-graphs/:fileName/exist', dialoggraphs.checkFile);
    app.get('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.findFile);
    app.get('/api/:botId/biz-dialog-graphs', dialoggraphs.find);
    app.post('/api/:botId/biz-dialog-graphs/uploadImage', dialoggraphs.uploadImage);
    app.post('/api/:botId/biz-dialog-graphs/uploadFile', dialoggraphs.uploadFile);
    app.post('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.saveFile);
    app.delete('/api/:botId/biz-dialog-graphs/:fileName', dialoggraphs.deleteFile);
    app.get('/api/:botId/biz-dialog-graphs/nlp/:text', dialoggraphs.getNlp);
};
