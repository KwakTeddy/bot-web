var demo = require('../controllers/demo.server.controller.js');

module.exports = function (app)
{
    app.get('/api/demo/context', demo.contextAnalytics);
};
