'use strict';

var path = require('path');
var net = require('net');
var _ = require('lodash');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var bot = require('../controllers/bot.server.controller');
var tough = require('tough-cookie');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

// var chatscriptConfig = {port: 0, host: '', allowHalfOpen: true};
var defaultOptions = {};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

// Create the chat configuration
module.exports = function (io, socket) {
  console.log('user connected');
  bot.setBotSocket(socket);

  socket.on('disconnect', function() {
    console.log('user disconnected')
  });

  socket.on('send_msg', function(msg) {
    bot.botProc(msg.bot, msg.channel || 'socket', msg.user, msg.msg, msg, function(_out, _task) {

      if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined)) {
        socket.emit('send_msg', _out);
      } else if(_task.result) {
        if(_task.result.text == undefined) _task.result.text = _out;
        socket.emit('send_msg', JSON.stringify(_task.result));
      } else {
        if(_task.text == undefined) _task.text = _out;
        socket.emit('send_msg', JSON.stringify(_task));
      }

    }, msg.options);

  })
};
