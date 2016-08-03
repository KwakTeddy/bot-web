'use strict';

var net = require('net');
var _ = require('lodash');
var moneybot = require('../controllers/moneybot.server.controller');
var action = require('../controllers/action.server.controller');

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
    if(global.users && global.users[msg.user] && global.users[msg.user].selectAccounts && global.users[msg.user].lastJSON) {
      var from = msg.user;
      var num = msg.msg.substr(0, 1);

      var serverJSON = {};
      serverJSON.action = 'selectAccount';
      serverJSON.accountNumber = num;
      moneybot.receivedMoneyBot(from, JSON.stringify(serverJSON), function(retText, json) {
        socket.emit('send_msg', retText + (json && json.url ? "\nurl: " + json.url : "") + " " +
          (json && json.buttons ? "\nbuttons: " + json.buttons: "")); // FROM SERVER
      });

      // BotUser.findOne({userKey: from}).populate('currentBank').exec(function (err, botUser) {
      //   if (botUser) {
      //
      //     botUser.currentAccount =  global.users[from].selectAccounts[num-1].accountNumber;
      //
      //     botUser.save(function (err) {
      //       global.users[from].selectAccounts = null;
      //       global.users[from].userAccounts = null;
      //
      //       var serverJSON = global.users[from].lastJSON;
      //       global.users[from].lastJSON = null;
      //       moneybot.receivedMoneyBot(msg.user, JSON.stringify(serverJSON), function(retText, json) {
      //         socket.emit('send_msg', retText + (json && json.url ? "\nurl: " + json.url : "") + " " +
      //           (json && json.buttons ? "\nbuttons: " + json.buttons: "")); // FROM SERVER
      //       });
      //     });
      //   }
      // });
    } else if(global.users && global.users[msg.user] && global.users[msg.user].selectBanks) {
      var from = msg.user;
      var num = msg.msg.substr(0, 1);

      var serverJSON = {};
      serverJSON.action = 'selectBank';
      serverJSON.bankNumber = num;
      moneybot.receivedMoneyBot(from, JSON.stringify(serverJSON), function(retText, json) {
        socket.emit('send_msg', retText + (json && json.url ? "\nurl: " + json.url : "") + " " +
          (json && json.buttons ? "\nbuttons: " + json.buttons: "")); // FROM SERVER
      });

      // BotUser.findOne({userKey: from}).populate('currentBank').exec(function (err, botUser) {
      //   if (botUser) {
      //
      //     botUser.currentAccount =  global.users[from].selectAccounts[num-1].accountNumber;
      //
      //     botUser.save(function (err) {
      //       global.users[from].selectAccounts = null;
      //       global.users[from].userAccounts = null;
      //
      //       var serverJSON = global.users[from].lastJSON;
      //       global.users[from].lastJSON = null;
      //       moneybot.receivedMoneyBot(msg.user, JSON.stringify(serverJSON), function(retText, json) {
      //         socket.emit('send_msg', retText + (json && json.url ? "\nurl: " + json.url : "") + " " +
      //           (json && json.buttons ? "\nbuttons: " + json.buttons: "")); // FROM SERVER
      //       });
      //     });
      //   }
      // });
    } else {

      console.log("사용자 입력>> " + msg.msg);
      action.processInput(msg.bot, msg.user, msg.msg, function(inText, inJson) {

        msg.msg = inText;
        console.log("자연어 처리>> " + msg.msg);

        var chatscriptSocket = net.createConnection(_.assign(chatscriptConfig, {host: msg.host, port: msg.port}), function(){
          chatscriptSocket.write(msg.user+'\x00'+msg.bot+'\x00'+msg.msg+'\x00');
          // console.log('send_msg')
        });

        // on receive data from chatscriptSocket
        chatscriptSocket.on('data', function(data) {
          console.log("챗서버 답변>> " + data.toString());

//      socket.emit('send_msg', data.toString()); // FROM SERVER

          action.execute(msg.bot, msg.user, data.toString(), inJson, function(text, inJson, outJson) {
            console.log("사용자 출력>> " + text + "\n");
            socket.emit('send_msg', text + (outJson && outJson.link ? "\nlink: " + outJson.link : "") + " " +
              (outJson && outJson.buttons ? "\nbuttons: " + outJson.buttons: "")); // FROM SERVER
          })

          //moneybot.receivedMoneyBot(msg.user, data.toString(), function(retText, json) {
          //  socket.emit('send_msg', retText + (json && json.url ? "\nurl: " + json.url : "") + " " +
          //    (json && json.buttons ? "\nbuttons: " + json.buttons: "")); // FROM SERVER
          //});

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
    }


  })
};
