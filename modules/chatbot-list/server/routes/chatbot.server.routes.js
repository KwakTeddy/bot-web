var chatbot = require('../controllers/chatbot.server.controller.js');

module.exports = function (app)
{
    app.route('/api/chatbots').get(chatbot.list);
};
