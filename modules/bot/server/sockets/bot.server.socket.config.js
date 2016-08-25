'use strict';

var path = require('path');
var net = require('net');
var _ = require('lodash');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var type = require(path.resolve('./modules/bot/action/common/type'));
var tough = require('tough-cookie');

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

    } else {
      var botName = msg.bot;
      var user = msg.user;
      var _inText = msg.msg;

      var context = getContext(botName, user);

      console.log("사용자 입력>> " + _inText);

      type.processInput(context, _inText, function(inText, inDoc) {

        console.log("자연어 처리>> " + inText);

        if(context.user.pendingCallback) {
          if(type[context.user.pendingType+'Type']) {
            type[context.user.pendingType+'Type'].typeCheck(inText, type[context.user.pendingType+'Type'], inDoc, context, function(_text, _inDoc) {
              if(!_inDoc[context.user.pendingType] && type[context.user.pendingType+'Type'].required) {
                socket.emit('send_msg', type[context.user.pendingType+'Type'].required(_text));
              } else {
                context.user.pendingCallback(_text);
              }
            });
          } else {
            context.user.pendingCallback(inText);
          }
          return;
        }

        var chatscriptSocket = net.createConnection(_.assign(chatscriptConfig, {host: msg.host, port: msg.port}), function(){
          chatscriptSocket.write(user+'\x00'+botName+'\x00'+inText+'\x00');
        });

        chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
          var chatserverOut = data.toString();

          console.log("챗서버 답변>> " + chatserverOut);

          botProcess.processChatserverOut(context, chatserverOut, inText, _inText, inDoc, function(_out, _task) {
            console.log("사용자 출력>> " + _out + "\n");
            socket.emit('send_msg', _out + (_task && _task.link ? "\nlink: " + _task.link : "") + " " +
              (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
          }, function(_out, _task) {
            console.log("오류 출력>> " + _out + "\n");
            socket.emit('send_msg', _out + (_task && _task.link ? "\nlink: " + _task.link : "") + " " +
              (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
          })
        });

        chatscriptSocket.on('end', function() {       // on end from chatscriptSocket
          // console.log('disconnected from server');
        });

        chatscriptSocket.on('error', function(err) {  // on error from chatscriptSocket
          console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
        });

      })
    }
  })
};

//var RiveScript = require(path.resolve('./external_modules/rivescript/rivescript'));
//
//var botPath = path.resolve('./custom_modules/testbot/brain');
//
//var bot = new RiveScript({
//  debug: true,
//  utf8:  true
//});
//
//bot.loadDirectory(botPath, loading_done, loading_error);
//
//function loading_done(batch_num) {
//  bot.sortReplies();
//
//  console.log("Bot Loaded: " + botPath);
//
//  //var reply = bot.reply("localuser", cmd);
//}
//
//function loading_error(error, loadBatch) {
//  console.error("Loading error: " + error);
//}
//
//

function getContext(botName, user) {
  if(!global._context) global._context = {};
  if(!global._bots) global._bots = [];
  if(!global._bots[botName]) global._bots[botName] = {};
  if(!global._users) global._users = [];
  if(!global._users[user]) global._users[user] = {};

  var context = {
    global: global._context,
    bot: global._bots[botName],
    user: global._users[user]
  };

  context.bot.botName = botName;
  context.user.userId = user;

  if(!context.user.cookie) context.user.cookie = new tough.CookieJar();

  return context;
}
