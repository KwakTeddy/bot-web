var net = require('net');
var moneybot = require('../controllers/moneybot.server.controller');

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = function(from, to, text, successCallback, errorCallback, endCallback) {

  if(global.users && global.users[from] && global.users[from].selectAccounts) {
    var num = text.substr(0, 1);

    BotUser.findOne({userKey: from}).populate('currentBank').exec(function (err, botUser) {
      if (botUser) {

        botUser.currentAccount = global.users[from].selectAccounts[num - 1].accountNumber;

        botUser.save(function (err) {
          global.users[from].selectAccounts = null;
          global.users[from].userAccounts = null;

          var serverJSON = global.users[from].lastJSON;
          global.users[from].lastJSON = null;
          moneybot.receivedMoneyBot(msg.user, JSON.stringify(serverJSON), function (retText, json) {
            socket.emit('send_msg', retText + (json && json.url ? " url: " + json.url : "") + " " +
              (json && json.buttons ? " buttons: " + json.buttons : "")); // FROM SERVER
          });
        });
      }
    });

  } else {
    var chatSocket = net.createConnection(chatSocketConfig, function(){
      var payload = from + '\x00' + to + '\x00' + text + '\x00';
      chatSocket.write(payload);

      console.log("send:" + text);
    });

    chatSocket.on('data', function(data) {
      console.log("received:" + data.toString());

      //successCallback(data.toString());

      moneybot.receivedMoneyBot(from, data.toString(), function(retText, url) {
        successCallback(retText, url);
      });
    })

    chatSocket.on('end', function() {
      if(endCallback) endCallback();
      // console.log('disconnected from server');
    })

    chatSocket.on('error', function(err) {
      if(errorCallback) errorCallback(err);
      console.log('error from server ' + err +' '+ chatSocket.address()[1]);
    })

  }

};

