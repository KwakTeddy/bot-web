var TemplateContentsController = require('../controllers/template-contents.server.controller.js');

module.exports = function(app)
{
    app.post('/api/:botId/template-contents/upload', TemplateContentsController.uploadImage);
    app.get('/api/:templateId/:botId/:datas', TemplateContentsController.findDatas);
    app.put('/api/:templateId/:botId/:datas', TemplateContentsController.updateData);
    app.post('/api/:templateId/:botId/:datas', TemplateContentsController.createDatas);
    app.post('/api/sendSMS', TemplateContentsController.sendSMS);

    // app.get('/api/:templateId/:botId/menus', TemplateContentsController.findMenus);
    // app.post('/api/:templateId/:botId/menus', TemplateContentsController.saveMenus);
    //
    // app.get('/api/:templateId/:botId/events', TemplateContentsController.findEvents);
    // app.post('/api/:templateId/:botId/events', TemplateContentsController.saveEvents);
};
