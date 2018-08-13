var DialogGraphInputController = require('../controllers/dialog-graph-input.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/analysis/dialog-graph-input', DialogGraphInputController.analysis);
};
