

var SendlistAnalysisController = require('../controllers/biz-sendlist-analysis.server.controller.js');

module.exports = function(app)
{

    app.get('/api/analysis/userSend', SendlistAnalysisController.UserSend);
    app.get('/api/analysis/botSend', SendlistAnalysisController.BotSend);
    app.get('/api/analysis/botSend', SendlistAnalysisController.BotOneSend);


    // app.get('/api/:botId/:startDate/:endDate/analysis/sendMsgNum', SendlistAnalysisController.getSendMsgsNumAndLastSendDateByBotId);
    // app.get('/api/:botId/:startDate/:endDate/analysis/resHumNum', SummaryAnalysisController.getresHumNumByBotId);
    // app.get('/api/:botId/:startDate/:endDate/analysis/TotalHumNum', SummaryAnalysisController.getTotalHumNumByBotId);


};
