var AdminController = require('../controllers/admin.server.controller.js');
var TemplateAdminController = require('../controllers/template-admin.server.controller.js');

module.exports = function(app)
{
    app.all('/api/admin/*', AdminController.core);
    app.get('/api/admin/template-categories', TemplateAdminController.findTemplateCategories);
    app.post('/api/admin/templates', TemplateAdminController.createTemplate);
};