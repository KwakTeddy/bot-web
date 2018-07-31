'use strict';

module.exports.init = function(socket)
{
    var Engine = require('../core.js');
    var Logger = require('../logger.js');

    // logger.systemLog('user connected');
    // bot.setBotSocket(socket);

    socket.on('disconnect', function()
    {
        // logger.systemLog('user disconnected')
    });

    socket.on('send_msg', function(msg)
    {
        // Logger.sockets[msg.user] = socket;

        if(msg.msg == ':humanViewMode')
        {
            //상담원이 특정 유저와 직접 상담을 한다고 하면 그 특정 유저의 key로 상담원 소켓을 저장해둔다.
            Logger.userSockets[msg.user] = socket;
        }
        else
        {
            Logger.sockets[msg.user] = socket; // 분석창을 위한
            Logger.channels[msg.user] = { name: 'socket', target: socket }; //ai - human 을 위한
        }

        Engine.process(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg.options, function(context, out)
        {
            socket.emit('send_msg', out);
        },
        function(err)
        {
            if(err == 'old-version')
            {
                socket.emit('send_error_msg', err);
            }
            else
            {
                socket.emit('send_error_msg', JSON.stringify(err));
            }
        });
    });

    socket.on('send_human_answer', function(msg)
    {
        var bot = msg.bot;
        var targetUser = msg.user;
        var channel = '';

        //상담원이 입력한걸 저장했다가 사용자의 채널로 쏴줘야 함.

        var channel = Logger.channels[targetUser];
        if(channel)
        {
            if(channel.name == 'socket')
            {
                channel.target.emit('chat_log', { type: 'dialog', output: { text: msg.msg }});
            }
        }
    });
};
