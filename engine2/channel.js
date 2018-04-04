// var line = require('./channel/line.server.controller');
// var facebook = require('./channel/facebook.server.controller');
// var navertalk = require('./channel/navertalk.server.controller');
// var wechat = require('./channel/wechat.server.controller');

var rest = require('./channel/rest.js');
var kakao = require('./channel/kakao.js');
var facebook = require('./channel/facebook.js');
var socketChannel = require('./channel/socket.js');
var line = require('./channel/line.js');
var navertalk = require('./channel/navertalk.js');
var telegram = require('./channel/telegram.js');
var wechat = require('./channel/wechat.js');

(function()
{
    var Channel = function()
    {

    };

    Channel.prototype.init = function(app, io)
    {
        io.on('connection', function (socket)
        {
            socketChannel.init(socket);
        });

        app.route('/chat/:bot/message').post(rest.message);
        //
        // // 카카오톡
        app.route('/kakao/:bot/keyboard').get(kakao.keyboard);
        app.route('/kakao/:bot/message').post(kakao.message);
        app.route('/kakao/:bot/friend').post(kakao.friend);
        app.route('/kakao/:bot/friend/:user_key').delete(kakao.deleteFriend);
        app.route('/kakao/:bot/chat_room/:user_key').delete(kakao.deleteChatRoom);
        //
        // // 라인
        app.route('/line/:bot/webhook').get(line.get);
        app.route('/line/:bot/webhook').post(line.post);
        // app.route('/line/:bot/webhook').post(lineTest.post);
        //
        // // 페이스북
        app.get('/facebook/webhook', facebook.get);
        app.post('/facebook/webhook', function(req, res){ facebook.post.call(facebook, req, res); });
        // app.route('/facebook/:bot/webhook').post(facebook.message);
        // app.route('/facebook/webhook/refresh').get(facebook.refresh);
        //
        // // 네이버 톡톡
        app.route('/navertalk/:botId/webhook').post(navertalk.message);

        app.route('/telegram/:token').post(function(req, res){ telegram.message.call(telegram, req, res); });
        //
        // // wechat
        app.route('/wechat/:bot/webhook').get(function(req, res){ wechat.get.call(wechat, req, res); });
        app.route('/wechat/:bot/webhook').post(function(req, res){ wechat.post.call(wechat, req, res); });
    };

    module.exports = new Channel();
})();
