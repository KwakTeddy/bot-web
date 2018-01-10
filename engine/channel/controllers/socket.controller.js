'use strict';

var path = require('path');
var bot = require('../controllers/bot.server.controller');

var logger = require(path.resolve('./config/lib/logger.js'));


module.exports = function (io, socket) {
    logger.systemLog('user connected');
    bot.setBotSocket(socket);

    socket.on('disconnect', function() {
        logger.systemLog('user disconnected')
    });

    socket.on('send_msg', function(msg) {

        logger.systemLog('메시지 : ', JSON.stringify(msg));
        bot.botProc(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg, function(_out, _task) {

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

    })

};
