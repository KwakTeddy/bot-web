var net = require('net');

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};
var chatBot = "";

exports.write = function(from, to, text, successCallback, errorCallback, endCallback) {
  var chatSocket = net.createConnection(chatSocketConfig, function(){
      var payload = from + '\x00' + chatBot + '\x00' + text + '\x00';
      chatSocket.write(payload);

      console.log("send:" + text);
  });

  chatSocket.on('data', function(data) {
    console.log("received:" + data.toString());

    successCallback(data.toString());
  })

  chatSocket.on('end', function() {
    if(endCallback) endCallback();
    // console.log('disconnected from server');
  })

  chatSocket.on('error', function(err) {
    if(errorCallback) errorCallback(err);
    console.log('error from server ' + err +' '+ chatSocket.address()[1]);
  })

};

