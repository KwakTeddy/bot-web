var SummaryAnalysisController = require('../controllers/biz-summary-analysis.server.controller.js');

module.exports = function(app)
{
    //mysql
    app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', SummaryAnalysisController.getSendMsgsNumAndLastSendDateByBotId);
    // app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgLastDate', SummaryAnalysisController.getLastSendDateByBotId);
    //mongodb
    app.get('/api/:botId/:startDate/:endDate/analysis/resHumNum', SummaryAnalysisController.getresHumNumByBotId);
    app.get('/api/:botId/:startDate/:endDate/analysis/TotalHumNum', SummaryAnalysisController.getTotalHumNumByBotId);
};
