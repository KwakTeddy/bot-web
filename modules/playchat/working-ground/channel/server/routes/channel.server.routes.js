var ChannelController = require('../controllers/channel.server.controller.js');

module.exports = function(app)
{
    app.route('/api/auth/facebook/pageInfo').post(ChannelController.facebookPage);
    app.post('/api/:botId/channel/line', ChannelController.saveLineAccessToken);
    app.get('/api/:botId/channel/line', ChannelController.getLineAccessToken);
    app.post('/api/:botId/channel/telegram', ChannelController.saveTelegramToken);
    app.get('/api/:botId/channel/telegram', ChannelController.getTelegramToken);
    app.post('/api/:botId/channel/wechat', ChannelController.saveWechatToken);
    app.get('/api/:botId/channel/wechat', ChannelController.getWechatToken);
};
