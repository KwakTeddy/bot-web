var dialogTrafficAnalysis = require('../controllers/dialog-traffic-analysis.server.controller.js');

module.exports = function(app)
{
    app.route('/api/daily-dialog-usage').post(dialogTrafficAnalysis.dailyDialogUsage);
};
