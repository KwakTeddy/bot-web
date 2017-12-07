var ChannelController = require('../controllers/channel.server.controller.js');

module.exports = function(app)
{
    app.route('/api/auth/facebook/pageInfo').post(ChannelController.facebookPage);
};
