'use strict';

var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

require('./models/dialogset.server.model.js');
require('./models/intent.server.model.js');
require('./models/bank.server.model.js');
require('./models/user-dialog.server.model.js');
require('./models/fact-link.server.model.js');
require('./models/file-bot.server.model.js');
require('./models/user-bot.server.model.js');
require('./models/bot-user.model.js');
require('./models/bot.server.model.js');
require('./models/entity.server.model.js');

require('./core/engine/common/globals').initGlobals();

var bot = require(path.resolve('./engine/core/bot.server.controller.js'));

// var ContextService = require('./context');

(function()
{
    var getContext = function(json)
    {
        ContextService.getContext(json.channel, json.botId, json.userId, json.options, function(context)
        {
            console.log(context);
        });
    };

    var process = function(json, callback)
    {
        logger.systemLog('================= Core Process =================');
        logger.systemLog(JSON.stringify(json));
        getContext(json, callback);
    };

    var initSocket = function(socket)
    {
        logger.systemLog('User is connected');

        socket.on('disconnect', function()
        {
            logger.systemLog('User is disconnected');
        });

        socket.on('send_msg', function(msg)
        {
            console.log(JSON.stringify(msg));
            bot.botProc(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg, function(_out, _task) {

                console.log(_out, _task);
                if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined)) {
                    socket.emit('send_msg', _out);
                } else if(_task.result) {
                    if(_task.result.text == undefined) _task.result.text = _out;
                    socket.emit('send_msg', JSON.stringify(_task.result));
                } else {
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
