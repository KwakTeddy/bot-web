'use strict';

var net = require('net');

var chatscriptConfig = {port: 1024, host: 'localhost', allowHalfOpen: true}
var chatscriptBot = ""

// Create the chat configuration
module.exports = function (io, socket) {
  console.log('user connected')
  socket.on('disconnect', function() {
    console.log('user disconnected')
  })

  socket.on('send_msg', function(msg) {
    var chatscriptSocket = net.createConnection(chatscriptConfig, function(){
      var payload = 'guest'+'\x00'+chatscriptBot+'\x00'+msg+'\x00';
      chatscriptSocket.write(payload)
      // console.log('send_msg')
    })
    // on receive data from chatscriptSocket
    chatscriptSocket.on('data', function(data) {
      console.log(data.toString());
      io.emit('send_msg', data.toString()); // FROM SERVER
    })
    // on end from chatscriptSocket
    chatscriptSocket.on('end', function() {
      // console.log('disconnected from server');
    })
    // on error from chatscriptSocket
    chatscriptSocket.on('error', function(err) {
      console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
    })

  })
};
