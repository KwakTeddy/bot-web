var net = require('net');
var path = require('path');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var tough = require('tough-cookie');
var _ = require('lodash');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = function(from, to, text, successCallback, errorCallback, endCallback) {

    botProc(to, from, text, successCallback, chatSocketConfig);

};

exports.botProc = botProc;

function botProc(botName, user, _inText, outCallback, chatServerConfig) {

  var context = getContext(botName, user);

  console.log("사용자 입력>> " + _inText);

  var type = utils.requireNoCache(path.resolve('./modules/bot/action/common/type'));

  type.processInput(context, _inText, function(inText, inDoc) {
    console.log("자연어 처리>> " + inText);

    if(context.user.pendingCallback) {
      if(inText.search(/(처음|메뉴)/g) != -1 || inText.startsWith(':')) {
        context.user.pendingCallback = null;
        context.user.pendingType = null;

      } else if(type[context.user.pendingType+'Type']) {

        var paramType = type[context.user.pendingType+'Type'];
        var paramDef = context.user.pendingParamDef;
        paramType.name = paramDef.name;

        paramType.typeCheck(_inText, paramType, inDoc, context, function(_text, _inDoc, matched) {

          paramType.name = paramDef.type;

          if(matched) {
            if(paramDef.customCheck) {
              paramDef.customCheck(_inText, paramType, inDoc, context, function(__text, __inDoc, _matched) {
                if(_matched) {
                  context.user.pendingCallback(inText, _inText, __inDoc);
                } else {
                  if(paramType.required) {
                    socket.emit('send_msg', paramType.required(__text) + '\n' +
                      context.global.messages.typeExit);
                  } else {
                    socket.emit('send_msg', (paramDef.question instanceof Function ? paramDef.question(__inDoc, context) : paramDef.question) + '\n' +
                      context.global.messages.typeExit);
                  }
                }
              });
            } else {
              context.user.pendingCallback(inText, _inText, _inDoc);
            }
          } else {
            if(paramType.required) {
              socket.emit('send_msg', paramType.required(_text) + '\n' +
                context.global.messages.typeExit);
            } else {
              socket.emit('send_msg', (paramDef.question instanceof Function ? paramDef.question(_inDoc, context) : paramDef.question) + '\n' +
                context.global.messages.typeExit);
            }
          }

        });

        return;
      } else {
        context.user.pendingCallback(inText, inDoc);
        return;
      }
    }

    var chatscriptSocket = net.createConnection(chatServerConfig, function(){
      chatscriptSocket.write(user+'\x00'+botName+'\x00'+inText+'\x00');
    });

    chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
      var chatserverOut = data.toString();

      console.log("챗서버 답변>> " + chatserverOut);

      botProcess.processChatserverOut(context, chatserverOut, inText, _inText, inDoc, function(_out, _task) {
        console.log("사용자 출력>> " + _out + "\n");

        outCallback(_out, _task);
      }, function(_out, _task) {
        console.log("오류 출력>> " + _out + "\n");

        outCallback(_out, _task);
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

  context.global.messages = messages;

  context.user.mobile = '010-6316-5683';

  return context;
}

var messages = {
  typeExit: '\n그만 하려면 "처음"이라고 입력해 주세요.',
  typeAddress: '주소 형식이 틀렸습니다.',
  typeAddressCheck1: '입력하신 주소가 없습니다.',
  yesRegExp: "응|그래|네|그렇다|오케이|예스|ㅇㅋ|ㅇㅇ|OK|ok|Ok|YES|yes|Yes",
  noRegExp: "아니다|싫다|않다|노|NO|no|No"

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
