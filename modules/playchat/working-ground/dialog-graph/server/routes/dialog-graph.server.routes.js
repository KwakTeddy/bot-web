var dialoggraphs = require('../controllers/dialog-graph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/dialoggraphs', dialoggraphs.find);
};
