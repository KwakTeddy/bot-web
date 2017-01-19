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
  bot.setBotSocket(socket);

  socket.on('disconnect', function() {
    console.log('user disconnected')
  });

  socket.on('send_msg', function(msg) {
    bot.botProc(msg.bot, msg.channel || 'socket', msg.user, msg.msg, function(_out, _task) {
      if(_task == undefined || _task.url != undefined ) {
        socket.emit('send_msg', _out +
          (_task && _task.photoUrl ? "\nphoto: " + _task.photoUrl : "") + " " +
          (_task && _task.photoWidth ? "\nwidth: " + _task.photoWidth : "") + " " +
          (_task && _task.photoHeight ? "\nheight: " + _task.photoHeight : "") + " " +
          (_task && _task.urlMessage ? "\nurlMessage: " + _task.urlMessage : "") + " " +
          (_task && _task.url ? "\nurl: " + _task.url : "") + " " +
          (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
      } else {
        var json = {text: _out};
        if(_task.photoUrl) json.photoUrl = _task.photoUrl;
        if(_task.photoWidth) json.photoWidth = _task.photoWidth;
        if(_task.photoHeight) json.photoHeight = _task.photoHeight;
        if(_task.urlMessage) json.urlMessage = _task.urlMessage;
        if(_task.url) json.url = _task.url;
        if(_task.buttons) json.buttons = _task.buttons;
        socket.emit('send_msg', JSON.stringify(json));
      }


    }, _.assign(chatscriptConfig, {host: msg.host, port: msg.port}));

  })
};
