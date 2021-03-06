'use strict';

module.exports = function (app)
{
    // Root routing
    var core = require('../controllers/core.server.controller');

    app.get('/web/chatbot/:botId', core.renderWebChatBot);
    app.get('/mobile/chatbot/:botId', core.renderMobileChatBot);

    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // To Log User Activity
    app.route('/logging').post(core.logging);

    // To Get Config
    app.route('/config').get(core.getConfig);

    // Return a 404 for all undefined api, module or lib routes
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

    app.route('/facebookOvertext/:index').get(core.fbOvertext);
    app.route('/notice').get(core.notice);

    // Define application route
    app.route('/*').get(core.renderIndex);
};
