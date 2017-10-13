'use strict';

var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

require('./models/dialogset.server.model.js');
require('./models/intent.server.model.js');
require('./models/bank.model.js');
require('./models/user-dialog.model.js');
require('./models/fact-link.model.js');
require('./models/file-bot.model.js');
require('./models/user-bot.server.model.js');
require('./models/bot-user.model.js');
require('./models/bot.model.js');
require('./models/entity.server.model.js');

require(path.resolve('./bot-engine/engine/common/globals.js')).initGlobals();

var bot = require(path.resolve('./bot-engine/bot.server.controller.js'));

(function()
{
    var initSocket = function(socket)
    {
        logger.systemLog('[BotEngine] User is connected');

        socket.on('disconnect', function()
        {
            logger.systemLog('[BotEngine] User is disconnected');
        });

        socket.on('send_msg', function(msg)
        {
            console.log();
            logger.systemLog('[BotEngine] User message : ' + JSON.stringify(msg));
            bot.botProc(msg.botId, msg.channel || 'socket', msg.userId, msg.rawText, msg, function(_out, _task)
            {
                console.log(_out, _task);
                if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined))
                {
                    socket.emit('send_msg', _out);
                }
                else if(_task.result)
                {
                    if(_task.result.text == undefined)
                        _task.result.text = _out;

                    socket.emit('send_msg', JSON.stringify(_task.result));
                }
                else
                {
                    _task.text = _out;
                    _task.topTask = undefined;
                    socket.emit('send_msg', JSON.stringify(_task));
                }

            }, msg.options, socket);
        });
    };

    module.exports.initialize = function(io, socket)
    {
        initSocket(socket);
    };
})();
