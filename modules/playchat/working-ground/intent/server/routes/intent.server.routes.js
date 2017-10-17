var intent = require('../controllers/intent.server.controller.js');

module.exports = function(app)
{
    app.post('/api/intents/uploadfile', intent.uploadFile);
    app.get('/api/:botId/intents/totalpage', intent.findTotalPage);
    app.get('/api/:botId/intents', intent.find);
    app.get('/api/:botId/intents/:intentId/contents', intent.findIntentContent);
    app.post('/api/:botId/intents', intent.create);
    app.put('/api/:botId/intents', intent.update);
    app.delete('/api/:botId/intents/:intentId', intent.delete);
};
