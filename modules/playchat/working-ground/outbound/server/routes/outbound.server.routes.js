var OutboundController = require('../controllers/outbound.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/bot-auth', OutboundController.find);
    app.put('/api/:botId/bot-auth/:_id', OutboundController.updateBotAuth);
    app.delete('/api/:botId/bot-auth/:_id', OutboundController.deleteBotAuth);

    app.get('/api/:botId/chatbot-edit', OutboundController.findBot);
    app.put('/api/:botId/chatbot-edit', OutboundController.updateBot);
    app.get('/api/:botId/chatbot-edit/options', OutboundController.getBotOptions);
    app.put('/api/:botId/chatbot-edit/options', OutboundController.updateBotOptions);
};
