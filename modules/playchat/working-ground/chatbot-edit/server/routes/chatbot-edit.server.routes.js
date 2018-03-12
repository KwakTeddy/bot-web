var ChatbotEditController = require('../controllers/chatbot-edit.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/bot-auth', ChatbotEditController.find);
    app.put('/api/:botId/bot-auth/:_id', ChatbotEditController.updateBotAuth);
    app.delete('/api/:botId/bot-auth/:_id', ChatbotEditController.deleteBotAuth);

    app.get('/api/:botId/chatbot-edit', ChatbotEditController.findBot);
    app.put('/api/:botId/chatbot-edit', ChatbotEditController.updateBot);
    app.get('/api/:botId/chatbot-edit/options', ChatbotEditController.getBotOptions);
    app.put('/api/:botId/chatbot-edit/options', ChatbotEditController.updateBotOptions);
};
