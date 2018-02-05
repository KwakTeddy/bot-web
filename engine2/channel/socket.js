'use strict';

module.exports.init = function(socket)
{
    var Engine = require('../core.js');

    // logger.systemLog('user connected');
    // bot.setBotSocket(socket);

    socket.on('disconnect', function()
    {
        // logger.systemLog('user disconnected')
    });

    socket.on('send_msg', function(msg)
    {
        Engine.process(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg.options, function(context, out)
        {
            console.log('아웃풋', out);
            socket.emit('send_msg', out);
        },
        function(err)
        {
            socket.emit('send_error_msg', JSON.stringify(err));
        });
    });
};
