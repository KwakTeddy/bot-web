var TemplateContentsController = require('../controllers/template-contents.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:templateName/:botId/menus', TemplateContentsController.findMenus);
    app.post('/api/:templateName/:botId/menus', TemplateContentsController.saveMenus);

    app.get('/api/:templateName/:botId/events', TemplateContentsController.findEvents);
    app.post('/api/:templateName/:botId/events', TemplateContentsController.saveEvents);

    app.post('/api/:botId/template-contents/upload', TemplateContentsController.uploadImage);
};
