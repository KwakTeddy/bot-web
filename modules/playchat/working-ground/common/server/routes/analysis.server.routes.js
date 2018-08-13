var analysis = require('../controllers/analysis.server.controller');

module.exports = function(app)
{
    app.route('/api/analytics/statistics/exel-download/:bId').post(analysis.exelDownload);
    app.route('/api/analytics/statistics/scenario/exel-download/:bId').post(analysis.scenarioExelDownload);
};
