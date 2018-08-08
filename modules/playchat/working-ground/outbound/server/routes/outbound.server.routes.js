var outboundservice = require('../controllers/outbound.server.controller.js');

module.exports = function(app)
{
    app.post('/api/outbound', outboundservice.check);
};
