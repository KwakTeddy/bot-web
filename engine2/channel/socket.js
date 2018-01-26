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
        Engine.process(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg.options, function(out)
        {
            socket.emit('send_msg', out);

            // if(task == undefined || (task.result == undefined && task.image == undefined && task.buttons == undefined && task.items == undefined))
            // {
            //     socket.emit('send_msg', out);
            // }
            // else if(task.result)
            // {
            //     if(task.result.text == undefined) task.result.text = out;
            //     socket.emit('send_msg', JSON.stringify(task.result));
            // }
            // else
            // {
            //     task.text = out;
            //     task.topTask = undefined;
            //     socket.emit('send_msg', JSON.stringify(task));
            // }
        },
        function(err)
        {
            socket.emit('send_error_msg', JSON.stringify(err));
        });
    });
};
