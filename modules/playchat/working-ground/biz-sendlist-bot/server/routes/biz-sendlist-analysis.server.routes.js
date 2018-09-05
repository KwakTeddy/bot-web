

var SendlistBotAnalysisController = require('../controllers/biz-sendlist-bot-analysis.server.controller.js');

module.exports = function(app)
{

    app.get('/api/analysis/botOneSend', SendlistBotAnalysisController.BotOneSend);

};
