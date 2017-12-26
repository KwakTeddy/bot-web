var AdminController = require('../controllers/admin.server.controller.js');
var TemplateAdminController = require('../controllers/template-admin.server.controller.js');

module.exports = function(app)
{
    app.all('/api/admin/*', AdminController.core);
    app.get('/api/template-categories', TemplateAdminController.findTemplateCategories);
    app.post('/api/admin/templates', TemplateAdminController.createTemplate);
    app.get('/api/admin/users/closed-beta', AdminController.findCloseBetaUser);
    app.post('/api/admin/users/closed-beta', AdminController.approveCloseBetaUser);

    app.post('/api/reporting', AdminController.saveReporting);
};
