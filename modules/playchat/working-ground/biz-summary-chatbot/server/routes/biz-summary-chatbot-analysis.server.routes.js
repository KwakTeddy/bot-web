var SummaryAnalysisController = require('../controllers/biz-summary-chatbot-analysis.server.controller.js');

module.exports = function(app)
{
    //mysql
    app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgNumForSendDate', SummaryAnalysisController.getSendMsgsNumByBotIdAndSendDate);
    // app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgLastDate', SummaryAnalysisController.getLastSendDateByBotId);
    //mongodb
    app.get('/api/:botId/:startDate/:endDate/analysis/resHumNum', SummaryAnalysisController.getresHumNumByBotId);
};
