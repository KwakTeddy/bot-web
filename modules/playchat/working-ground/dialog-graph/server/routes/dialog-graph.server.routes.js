var dialoggraphs = require('../controllers/dialoggraph.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/dialoggraphs', dialoggraphs.find);
};
