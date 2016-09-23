'use strict';

var path = require('path');
var net = require('net');
var _ = require('lodash');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var bot = require('../controllers/bot.server.controller');
var tough = require('tough-cookie');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

var chatscriptConfig = {port: 0, host: '', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

// Create the chat configuration
module.exports = function (io, socket) {
  console.log('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected')
  });

  socket.on('send_msg', function(msg) {

    bot.botProc(msg.bot, 'socket', msg.user, msg.msg, function(_out, _task) {
      socket.emit('send_msg', _out +
        (_task && _task.photoUrl ? "\nphoto: " + _task.photoUrl : "") + " " +
        (_task && _task.photoWidth ? "\nwidth: " + _task.photoWidth : "") + " " +
        (_task && _task.photoHeight ? "\nheight: " + _task.photoHeight : "") + " " +
        (_task && _task.urlMessage ? "\nurlMessage: " + _task.urlMessage : "") + " " +
        (_task && _task.url ? "\nurl: " + _task.url : "") + " " +
        (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
    }, _.assign(chatscriptConfig, {host: msg.host, port: msg.port}));

  })
};
