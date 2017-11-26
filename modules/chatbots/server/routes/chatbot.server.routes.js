var chatbot = require('../controllers/chatbot.server.controller.js');

var ChatbotTemplateController = require('../controllers/chatbot-template.server.controller.js');

module.exports = function (app)
{
    app.get('/api/chatbots/templates', ChatbotTemplateController.find);
    app.get('/api/chatbots/templates/:templateId', ChatbotTemplateController.findOne);
    app.get('/api/:botId/template-data', ChatbotTemplateController.findTemplateData);
    app.put('/api/:botId/template-data', ChatbotTemplateController.updateData);
    app.post('/api/:botId/template-data', ChatbotTemplateController.saveData);


    app.get('/api/chatbots/totalpage', chatbot.findTotalPage);
    app.route('/api/chatbots').get(chatbot.find).post(chatbot.create);
    app.route('/api/chatbots/:botId').get(chatbot.findOne).put(chatbot.update).delete(chatbot.delete);
    app.post('/api/chatbots/:botId/duplicate', chatbot.duplicate);
};
