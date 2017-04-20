var net = require('net');
var path = require('path');
var botProcess = require('../controllers/_action.server.controller');
var tough = require('tough-cookie');
var _ = require('lodash');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));
var dialog = require(path.resolve('modules/bot/action/common/dialog'));
var async = require('async');
var fs = require('fs');
var command = require(path.resolve('modules/bot/action/common/command'));
var botModule = require(path.resolve('./config/lib/bot'));
var factModule = require(path.resolve('modules/bot/action/common/facts'));
var toneModule = require(path.resolve('modules/bot/action/common/tone'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));
var dialogsetModule = require(path.resolve('modules/bot/engine/dialogset/dialogset'));

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = write;
function write(channel, from, to, text, json, successCallback, errorCallback, endCallback) {
    botProc(to, channel, from, text, json, successCallback, chatSocketConfig);
};

exports.botProc = botProc;

var botSocket;

exports.setBotSocket = function(socket) {botSocket = socket};

// console = {};
console.log = function(out) {
  process.stdout.write(out+'\n');
  if(botSocket) botSocket.emit('send_msg', ":log \n" + out +"\n");
}

console.error = function(out) {
  process.stderr.write((out.stack ? out.stack : out) +'\n');
  if(botSocket) botSocket.emit('send_msg', ":log \n" + (out.stack ? out.stack : out) +"\n");
}

// console.trace = function(out, t) {
//   process.stderr.write(out+'\n');
//   if(botSocket) botSocket.emit('send_msg', ":log \n" + out +"\n");
// }

function botProc(botName, channel, user, inTextRaw, json, outCallback, options) {
  // TODO 개발용
  dialog = utils.requireNoCache(path.resolve('modules/bot/action/common/dialog'));
  console.log(JSON.stringify(json));
  var startTime = new Date();
  var print = function(_out, _task) {
    var endTime = new Date();
    logger.debug("사용자 출력 (" + (endTime-startTime) + 'ms)>> ' + _out + "\n");

    // toneModule.toneSentence(_out, context.botUser.tone || '해요체', function(out) {
    //   _out = out;

      if(_task && _task.photoUrl && !_task.photoUrl.startsWith('http')) {
        _task.photoUrl = (process.env.HTTP_HOST ? process.env.HTTP_HOST : '') + _task.photoUrl;
      }

      var pre = (context.botUser.curBotId && context.botUser.curBotName && context.botUser.curBotId != botName ?
        context.botUser.curBotName + ': ' : undefined);

      if(channel == 'ios' || channel == 'android') {
        outCallback(_out, _task);
      } else {
        if(_out.indexOf('|') == -1) outCallback(pre == undefined ? _out : pre + '"' + _out + '"', _task);
        else {
          var arr = _out.split('|');
          outCallback(pre == undefined ? arr[0] : pre + '"' + arr[0] + '"', _task);
        }
      }
    // });
  };

  var context, inTextNLP, inDoc;
  async.waterfall([

    function(cb) {
      contextModule.getContext(botName, channel, user, options, function(_context) {
        context = _context;
        cb(null);
      });
    },

    function(cb) {
      logger.debug("사용자 입력>> " + inTextRaw);
      var type = utils.requireNoCache(path.resolve('./modules/bot/action/common/type'));

      type.processInput(context, inTextRaw, function(_inTextNLP, _inDoc) {
        logger.debug("자연어 처리>> " + _inTextNLP);
        inTextNLP = _inTextNLP;
        inDoc = utils.merge(_inDoc, json);
        cb(null);
      });
    },

    function(cb) {
      if (context.botUser.nlp) {
        context.botUser.sentenceInfo = dialogsetModule.analyzeSentence(inTextRaw, null, context.botUser.nlpAll);

        if(context.bot.useMemoryFacts) {
          factModule.memoryFacts(inTextRaw, context, function (_task, _context) {
            if(_task && _task.numAffected && _task.numAffected.upserted) {
              console.log('[FACT_ADD]' + JSON.stringify(_task.doc));
              print('말씀하신 내용을 학습했어요.');
              cb(true);
              return;
            }
            cb(null);
          });
        } else {
          cb(null);
        }
      } else {
        cb(null);
      }
    },

    function(cb) {
      context.dialog.inCurRaw = inTextRaw;
      context.dialog.inCurNLP = inTextNLP;

      if(inTextRaw.startsWith(':')) {
        command.command(inTextRaw, inTextNLP, context, print, function(matched) {
          if(matched) cb(true);
          else cb(null);
        });
      } else if(context.user.pendingCallback) {
        if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true && 
          inTextRaw.search(/(처음|메뉴)/g) != -1 || inTextRaw.startsWith(':')) {
          context.user.pendingCallback = null;
          context.user.pendingType = null;
          cb(null);
        } else {
          context.user.pendingCallback(inTextRaw, inTextNLP, inDoc, context, print, print);
          cb(true);
        }
      } else if(context.bot.dialogs) {
        context.botUser.currentDialog = null;

        context.botUser._dialog = {};
        context.dialog = context.botUser._dialog;

        context.dialog.inRaw = inTextRaw;
        context.dialog.inNLP = inTextNLP;

        if(context.bot.bMultiSentence &&
          !(context.botUser.sentenceInfo.sentenceType == 1 || context.botUser.sentenceInfo.sentenceType == 2 ||context.botUser.sentenceInfo.sentenceType == 3)) {
          dialog.sympathize(inTextRaw, inTextNLP, context, print, function() {
            cb(true);
          })
        } else {
          dialog.matchGlobalDialogs(inTextRaw, inTextNLP, context.bot.dialogs, context, print, function(matched, _dialog) {
            if(matched) {
              if(_dialog) console.log('[DIALOG_SEL]' + JSON.stringify({id: _dialog.id, name: _dialog.name, input: _dialog.input}));
              cb(true);
            }
            else cb(null);
          })
        }

      } else {
        cb(null);
      }
    },

    function(cb) {
      if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true) {
        var chatscriptSocket = net.createConnection(options.chatServerConfig, function(){
          chatscriptSocket.write(user+'\x00'+ /*botName*/ '' +'\x00'+inTextNLP+'\x00');
        });

        chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
          var chatserverOut = data.toString();

          logger.debug("챗서버 답변>> " + chatserverOut);

          botProcess.processChatserverOut(context, chatserverOut, inTextNLP, inTextRaw, inDoc, print, print)
        });

        chatscriptSocket.on('end', function() {       // on end from chatscriptSocket
          console.log('disconnected from server');
        });

        chatscriptSocket.on('error', function(err) {  // on error from chatscriptSocket
          console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
        });

        cb(null);
      } else {
        cb(null);
      }
    }
  ]);
}

// exports.getContext = getContext;
// function getContext(botName, channel, user, callback) {
//   // if(!global._context) global._context = {};
//   // if(!global._bots) global._bots = {};
//   // if(!global._channels) global._channels = {};
//   // if(!global._users) global._users = {};
//   // if(!global._botusers) global._botusers = {};
//
//   var userContext, botUserContext;
//   var botContext;
//   async.waterfall([
//     function(cb) {
//       // if (!global._bots[botName]) global._bots[botName] = {};
//       if (!global._channels[channel]) global._channels[channel] = {};
//
//       if (user == undefined) {
//         cb(null);
//       } else if (!global._users[user]) {
//         var botUser = require(path.resolve('./modules/bot-users/server/controllers/bot-users.server.controller'));
//         var _user = {userId: user, channel: channel, bot: botName};
//         botUser.getUserContext(_user, null, function (_user, _context) {
//           userContext = {userId: user, channel: channel, bot: botName};
//           userContext = utils.merge(userContext, _user.doc._doc);
//
//           if (userContext.address)
//             userContext.addressCompact = userContext.address.지번주소.replace(/^([가-힣]+\s*)/, function (matched, p1) {
//               return ''
//             });
//           // userContext.addressCompact = userContext.addressCompact.replace(/(\s+\(.*\))/, function(matched, p1) {return ''});
//
//           global._users[user] = userContext;
//           cb(null);
//         });
//       } else {
//         userContext = global._users[user];
//         cb(null);
//       }
//     }, function(cb) {
//       if(user != undefined) {
//         var botUserName;
//         botUserName = botName + '_' + user;
//         if(!global._botusers[botUserName]) global._botusers[botUserName] = {};
//         botUserContext = global._botusers[botUserName];
//         if(!botUserContext._dialog) botUserContext._dialog = {};
//         if(!botUserContext._task) botUserContext._task = {};
//       }
//
//       if(botUserContext.curBotName) botName = botUserContext.curBotName;
//
//       cb(null);
//     }, function(cb) {
//       if(global._bots[botName]) {
//         botContext = global._bots[botName];
//         cb(null);
//       } else if(global._userbots[botName]) {
//         botContext = global._userbots[botName];
//         cb(null);
//       } else {
//         botModule.loadBot(botName);
//         botContext = global._bots[botName];
//         if(botContext) {
//           cb(null);
//         } else {
//           botModule.loadUserBot(botName, function(_userBot) {
//             if(_userBot) {
//               botContext = _userBot;
//             } else {
//               botModule.loadBot(botName);
//               botContext = global._bots[botName];
//               if(botContext == undefined) botContext = {};
//             }
//
//             cb(null);
//           })
//         }
//       }
//     }
//   ], function(err) {
//     var context = {
//       global: global._context,
//       bot: botContext,
//       channel: global._channels[channel],
//       user: userContext,
//       botUser: botUserContext,
//       dialog: (botUserContext ? botUserContext._dialog : undefined),
//       task: (botUserContext ? botUserContext._task : undefined)
//     };
//
//     if(context.bot) context.bot.botName = botName;
//     if(context.channel) context.channel.name = channel;
//     if(context.user) {
//       context.user.userId = user;
//       if(!context.user.cookie) context.user.cookie = new tough.CookieJar();
//     }
//
//
//     context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
//     context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);
//
//     // context.global.messages = messages;
//
//     // context.user.mobile = '010-6316-5683';
//
//     callback(context);
//   });
//
// }
//
//
