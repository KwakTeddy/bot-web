var GnbController = require('../controllers/gnb.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:templateId/gnb', GnbController.getTemplateGnb);
};
