var chatbot = require('../controllers/chatbot.server.controller.js');

module.exports = function (app)
{
    app.get('/api/chatbots/totalpage', chatbot.findTotalPage);
    app.route('/api/chatbots').get(chatbot.find).post(chatbot.create);
    app.route('/api/chatbots/:botId').get(chatbot.findOne).put(chatbot.update).delete(chatbot.delete);
    app.post('/api/chatbots/:botId/duplicate', chatbot.duplicate);
};
