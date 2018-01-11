// var rest = require('./channel/rest.server.controller');
// var kakao = require('./channel/kakao.server.controller');
// var line = require('./channel/line.server.controller');
// var facebook = require('./channel/facebook.server.controller');
// var navertalk = require('./channel/navertalk.server.controller');
// var wechat = require('./channel/wechat.server.controller');

var socketChannel = require('./channel/socket.js');

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

            // require(path.resolve('./engine2/bot/server/sockets/bot.server.socket.config.js'))(app.io, socket);
            // require(path.resolve('./modules/demo/server/controllers/demo.server.controller.js'))(app.io, socket);
        });

        // app.route('/chat/:bot/message').post(rest.message);
        //
        // // 카카오톡
        // app.route('/kakao/:bot/keyboard').get(kakao.keyboard);
        // app.route('/kakao/:bot/message').post(kakao.message);
        // app.route('/kakao/:bot/friend').post(kakao.friend);
        // app.route('/kakao/:bot/friend/:user_key').delete(kakao.deleteFriend);
        // app.route('/kakao/:bot/chat_room/:user_key').delete(kakao.deleteChatRoom);
        //
        // // 라인
        // app.route('/line/:bot/receive').get(line.receiveGet);
        // app.route('/line/:bot/receive').post(line.receiveNew);
        //
        // // 페이스북
        // app.route('/facebook/:bot/webhook').get(facebook.messageGet);
        // app.route('/facebook/:bot/webhook').post(facebook.message);
        // app.route('/facebook/webhook/refresh').get(facebook.refresh);
        //
        // // 네이버 톡톡
        // app.route('/navertalk/:bot/webhook').post(navertalk.message);
        //
        // // wechat
        // app.route('/wechat/:bot/webhook').get(wechat.messageGet);
        // app.route('/wechat/:bot/webhook').post(wechat.message);
    };

    module.exports = new Channel();
})();
