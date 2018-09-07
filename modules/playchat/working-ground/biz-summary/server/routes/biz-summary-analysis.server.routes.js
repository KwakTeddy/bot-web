var SummaryAnalysisController = require('../controllers/biz-summary-analysis.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', SummaryAnalysisController.getSendMsgsNumAndLastSendDateByBotId);
    app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgLastDate', SummaryAnalysisController.getLastSendDateByBotId);
};
