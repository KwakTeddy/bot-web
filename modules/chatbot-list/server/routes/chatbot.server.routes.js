var chatbot = require('../controllers/chatbot.server.controller.js');

module.exports = function (app)
{
    app.route('/api/chatbots').get(chatbot.find);
    app.route('/api/chatbots/:id').get(chatbot.findOne);
};
