var GnbController = require('../controllers/gnb.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:templateName/gnb', GnbController.getTemplateGnb);
};
