var dialoggraphs = require('../controllers/dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/dialoggraphs/:fileName', dialoggraphs.findFile);
    app.get('/api/:botId/dialoggraphs', dialoggraphs.find);
    app.post('/api/:botId/dialoggraphs/uploadImage', dialoggraphs.uploadImage);
    app.post('/api/:botId/dialoggraphs/:fileName', dialoggraphs.saveFile);
    app.get('/api/:botId/dialoggraphs/nlp/:text', dialoggraphs.getNlp);
};
