var outboundservice = require('../controllers/outbound.server.controller.js');

module.exports = function(app)
{
    app.post('/api/outbound/:userId/upload/:tag', outboundservice.uploadFile);
    app.post('/api/outbound', outboundservice.check);

    app.get('/api/telebook/:userId/:tag', outboundservice.getTeleBook);
    app.delete('/api/telebook/:userId/:tag', outboundservice.deleteTeleBook);
};
