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
        Logger.sockets[msg.user] = socket;

        Engine.process(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg.options, function(context, out)
        {
            console.log('아웃풋', out);
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

        var socket = Logger.sockets[targetUser];
        if(socket)
        {
            socket.emit('send_msg', { type: 'dialog', output: { text: msg.msg }});
        }
    });
};
