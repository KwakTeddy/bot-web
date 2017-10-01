var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

var processManager = require(path.resolve('./bot-engine/modules/process-manager.js'));

(function()
{
    var SocketReceiver = function()
    {

    };

    SocketReceiver.prototype.initialize = function(core, io, done)
    {
        io.on('connection', function (socket)
        {
            logger.systemLog('[BotEngine] User is connected');

            socket.on('disconnect', function()
            {
                logger.systemLog('[BotEngine] User is disconnected');
            });

            socket.on('send_msg', function(requestData)
            {
                console.log();
                logger.systemLog('[BotEngine] User Request : ' + JSON.stringify(requestData));

                var responseCallback = function(){

                };
                core.process(requestData, responseCallback);
                // bot.botProc(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg, function(_out, _task)
                // {
                //     console.log(_out, _task);
                //     if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined))
                //     {
                //         socket.emit('send_msg', _out);
                //     }
                //     else if(_task.result)
                //     {
                //         if(_task.result.text == undefined)
                //             _task.result.text = _out;
                //
                //         socket.emit('send_msg', JSON.stringify(_task.result));
                //     }
                //     else
                //     {
                //         _task.text = _out;
                //         _task.topTask = undefined;
                //         socket.emit('send_msg', JSON.stringify(_task));
                //     }
                //
                // }, msg.options, socket);
            });
        });

        done();
        logger.systemLog(' - Socket Receiver loaded');
    };

    module.exports = new SocketReceiver();
})();
