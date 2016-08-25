var net = require('net');
var path = require('path');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var type = require(path.resolve('./modules/bot/action/common/type'));
var tough = require('tough-cookie');
var _ = require('lodash');

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = function(from, to, text, successCallback, errorCallback, endCallback) {

  if(global.users && global.users[from] && global.users[from].selectAccounts && global.users[from].lastJSON) {
    var num = text.substr(0, 1);
    var serverJSON = {};
    serverJSON.action = 'selectAccount';
    serverJSON.accountNumber = num;
    moneybot.receivedMoneyBot(from, JSON.stringify(serverJSON), function (retText, json) {
      successCallback(retText, json);
    });

  } else if(global.users && global.users[from] && global.users[from].selectBanks) {
    var num = text.substr(0, 1);
    var serverJSON = {};
    serverJSON.action = 'selectBank';
    serverJSON.bankNumber = num;
    moneybot.receivedMoneyBot(from, JSON.stringify(serverJSON), function (retText, json) {
      successCallback(retText, json);
    });

  } else {
    var botName = to;
    var user = from;
    var _inText = text;

    var context = getContext(botName, user);

    console.log("사용자 입력>> " + _inText);

    type.processInput(context, _inText, function(inText, inDoc) {

      console.log("자연어 처리>> " + inText);

      if(context.user.pendingCallback) {
        if(type[context.user.pendingType+'Type']) {
          type[context.user.pendingType+'Type'].typeCheck(inText, type[context.user.pendingType+'Type'], inDoc, context, function(_text, _inDoc) {
            if(!_inDoc[context.user.pendingType] && type[context.user.pendingType+'Type'].required) {
              successCallback(type[context.user.pendingType+'Type'].required(_text), _inDoc);
            } else {
              context.user.pendingCallback(_text);
            }
          });
        } else {
          context.user.pendingCallback(inText);
        }
        return;
      }

      var chatscriptSocket = net.createConnection(chatSocketConfig, function(){
        chatscriptSocket.write(user+'\x00'+botName+'\x00'+inText+'\x00');
      });

      chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
        var chatserverOut = data.toString();

        console.log("챗서버 답변>> " + chatserverOut);

        botProcess.processChatserverOut(context, chatserverOut, inText, _inText, inDoc, function(_out, _task) {
          console.log("사용자 출력>> " + _out + "\n");

          successCallback(_out, _task);

          // socket.emit('send_msg', _out + (_task && _task.link ? "\nlink: " + _task.link : "") + " " +
          //   (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
        }, function(_out, _task) {
          console.log("오류 출력>> " + _out + "\n");

          successCallback(_out, _task);

          // socket.emit('send_msg', _out + (_task && _task.link ? "\nlink: " + _task.link : "") + " " +
          //   (_task && _task.buttons ? "\nbuttons: " + _task.buttons: ""));
        })
      });

      chatscriptSocket.on('end', function() {       // on end from chatscriptSocket
        // console.log('disconnected from server');
      });

      chatscriptSocket.on('error', function(err) {  // on error from chatscriptSocket
        console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
      });

    })


    // var chatSocket = net.createConnection(chatSocketConfig, function(){
    //   var payload = from + '\x00' + to + '\x00' + text + '\x00';
    //   chatSocket.write(payload);
    //
    //   console.log("send:" + text);
    // });
    //
    // chatSocket.on('data', function(data) {
    //   console.log("received:" + data.toString());
    //
    //   //successCallback(data.toString());
    //
    //   moneybot.receivedMoneyBot(from, data.toString(), function(retText, url) {
    //     successCallback(retText, url);
    //   });
    // })
    //
    // chatSocket.on('end', function() {
    //   if(endCallback) endCallback();
    //   // console.log('disconnected from server');
    // })
    //
    // chatSocket.on('error', function(err) {
    //   if(errorCallback) errorCallback(err);
    //   console.log('error from server ' + err +' '+ chatSocket.address()[1]);
    // })

  }

};


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
