var dialoggraphs = require('../controllers/dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/dialog-graphs/:fileName/exist', dialoggraphs.checkFile);
    app.get('/api/:botId/dialog-graphs/:fileName', dialoggraphs.findFile);
    app.get('/api/:botId/dialog-graphs', dialoggraphs.find);
    app.post('/api/:botId/dialog-graphs/uploadImage', dialoggraphs.uploadImage);
    app.post('/api/:botId/dialog-graphs/uploadFile', dialoggraphs.uploadFile);
    app.post('/api/:botId/dialog-graphs/:fileName', dialoggraphs.saveFile);
    app.delete('/api/:botId/dialog-graphs/:fileName', dialoggraphs.deleteFile);
    app.get('/api/:botId/dialog-graphs/nlp/:text', dialoggraphs.getNlp);
};
