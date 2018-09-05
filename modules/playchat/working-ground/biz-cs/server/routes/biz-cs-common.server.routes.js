var CSCommonController = require('../controllers/biz-cs-common.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/total-dialog-counts', CSCommonController.totalDialogCount);
};
