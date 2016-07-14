'use strict';

var net = require('net');
var _ = require('lodash');
var moneybot = require('../controllers/moneybot.server.controller');

var chatscriptConfig = {port: 0, host: '', allowHalfOpen: true};


// Create the chat configuration
module.exports = function (io, socket) {
  console.log('user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected')
  });

  socket.on('send_msg', function(msg) {
    var chatscriptSocket = net.createConnection(_.assign(chatscriptConfig, {host: msg.host, port: msg.port}), function(){
      chatscriptSocket.write(msg.user+'\x00'+msg.bot+'\x00'+msg.msg+'\x00');
      // console.log('send_msg')
    });

    // on receive data from chatscriptSocket
    chatscriptSocket.on('data', function(data) {
      console.log(data.toString());

//      socket.emit('send_msg', data.toString()); // FROM SERVER

      moneybot.receivedMoneyBot(msg.user, data.toString(), function(retText, json) {
        socket.emit('send_msg', retText + (json && json.url ? " url: " + json.url : "") + " " +
          (json && json.buttons ? " buttons: " + json.buttons: "")); // FROM SERVER
      });

    });
    // on end from chatscriptSocket
    chatscriptSocket.on('end', function() {
      // console.log('disconnected from server');
    });
    // on error from chatscriptSocket
    chatscriptSocket.on('error', function(err) {
      console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
    });

  })
};
