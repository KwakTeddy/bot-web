

var SendlistAnalysisController = require('../controllers/biz-sendlist-analysis.server.controller.js');

module.exports = function(app)
{

    app.get('/api/:botId/analysis/botRegister', SendlistAnalysisController.botRegister);
    app.get('/api/:botId/analysis/successSend', SendlistAnalysisController.sendMsg);

};
