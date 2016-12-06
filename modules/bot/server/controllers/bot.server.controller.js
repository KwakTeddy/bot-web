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

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = write;
function write(channel, from, to, text, successCallback, errorCallback, endCallback) {
    botProc(to, channel, from, text, successCallback, chatSocketConfig);
};

exports.botProc = botProc;

function botProc(botName, channel, user, inTextRaw, outCallback, chatServerConfig) {

  // TODO 개발용
  dialog = utils.requireNoCache(path.resolve('modules/bot/action/common/dialog'));

  var print = function(_out, _task) {
    logger.debug("사용자 출력>> " + _out + "\n");

    if(_task && _task.photoUrl && !_task.photoUrl.startsWith('http')) {
      _task.photoUrl = (process.env.HTTP_HOST ? process.env.HTTP_HOST : '') + _task.photoUrl;
    }

    if(channel == 'ios' || channel == 'android') {
      outCallback(_out, _task);
    } else {
      if(_out.indexOf('|') == -1) outCallback(_out, _task);
      else {
        var arr = _out.split('|');
        outCallback(arr[0], _task);
      }
    }
  };

  var context, inTextNLP, inDoc;
  async.waterfall([

    function(cb) {
      getContext(botName, channel, user, function(_context) {
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
        inDoc = _inDoc;
        cb(null);
      });
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

        dialog.matchGlobalDialogs(inTextRaw, inTextNLP, context.bot.dialogs, context, print, function(matched) {
          if(matched) cb(true);
          else cb(null);
        })
      } else {
        cb(null);
      }
    },

    function(cb) {
      if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true) {
        var chatscriptSocket = net.createConnection(chatServerConfig, function(){
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

exports.getContext = getContext;
function getContext(botName, channel, user, callback) {
  // if(!global._context) global._context = {};
  // if(!global._bots) global._bots = {};
  // if(!global._channels) global._channels = {};
  // if(!global._users) global._users = {};
  // if(!global._botusers) global._botusers = {};

  var userContext, botUserContext;

  async.waterfall([
    function(cb) {
      if(!global._bots[botName]) global._bots[botName] = {};
      if(!global._channels[channel]) global._channels[channel] = {};

      if(user == undefined) {
        cb(null);
      } else if(!global._users[user]) {
        var botUser = require(path.resolve('./modules/bot-users/server/controllers/bot-users.server.controller'));
        var _user =  {userId: user, channel: channel, bot: botName};
        botUser.getUserContext(_user, null, function(_user, _context) {
          userContext = {userId: user, channel: channel, bot: botName};
          userContext = utils.merge(userContext, _user.doc._doc);

          if(userContext.address)
            userContext.addressCompact = userContext.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
          // userContext.addressCompact = userContext.addressCompact.replace(/(\s+\(.*\))/, function(matched, p1) {return ''});

          global._users[user] = userContext;
          cb(null);
        });
      } else {
        userContext = global._users[user];
        cb(null);
      }
    }, function(cb) {
      if(user != undefined) {
        var botUserName;
        botUserName = botName + '_' + user;
        if(!global._botusers[botUserName]) global._botusers[botUserName] = {};
        botUserContext = global._botusers[botUserName];
        if(!botUserContext._dialog) botUserContext._dialog = {};
        if(!botUserContext._task) botUserContext._task = {};
      }
      cb(null);
    }
  ], function(err) {
    var context = {
      global: global._context,
      bot: global._bots[botName],
      channel: global._channels[channel],
      user: userContext,
      botUser: botUserContext,
      dialog: (botUserContext ? botUserContext._dialog : undefined),
      task: (botUserContext ? botUserContext._task : undefined)
    };

    if(context.bot) context.bot.botName = botName;
    if(context.channel) context.channel.name = channel;
    if(context.user) {
      context.user.userId = user;
      if(!context.user.cookie) context.user.cookie = new tough.CookieJar();
    }


    context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
    context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);

    // context.global.messages = messages;

    // context.user.mobile = '010-6316-5683';

    callback(context);
  });

}


// var orderbot = require(path.resolve('custom_modules/order/order.dialog'));
// var sample = require(path.resolve('custom_modules/sample/sample.dialog'));
// global._bots = {
//
//   sample: {
//     module: 'sample.dialog',
//     dialogs: sample.dialogs
//   },
//
//   order: {
//     module: 'order.dialog',
//     commonDialogs: orderbot.commonDialogs,
//     dialogs: orderbot.dialogs,
//     dialogServer: {chatScript: false},
//     kakao: {
//       keyboard: { type :"buttons", buttons:["배달주문시작", "배달내역보기"]}
//     },
//     facebook: {
//       id: '1006864529411088',
//       APP_SECRET :  "eb2974959255583150013648e7ac5da4",
//       PAGE_ACCESS_TOKEN :  "EAAJGZBCFjFukBAE63miCdcKFwqTEmbbhSbm6jIr6ws5I7fKnWSMUqIzGfHZBDTqmW0wra5xZBZCLWg2O9miPcc6WdVQRyfHdDCYuhLjIbng0njUHqOdbasHcSZAs2WEO7zG72wgmciNsF138QCq1vLnzMHR3XYIP0VnV1iZBsZAngZDZD",
//       VALIDATION_TOKEN : "moneybrain_token"
//     },
//     managers: [
//       {platform: 'facebook', userId: '1094114534004265', name: '장세영'},
//       {platform: 'facebook', userId: '997804450331458', name: '테스트'}
//     ],
//
//     messages: {
//       manager:  false,
//       orderCall: false
//     },
//
//     concepts: {
//       '배달': ['주문', '시키다', '보내다']
//     }
//   },
//
//   moneybot: {
//     kakao: {
//       keyboard: { type :"buttons", buttons:["잔액조회", "상품추천", "고객상담"]}
//     },
//     facebook: {
//       APP_SECRET :  "174b2a851e3811c3f2c267d46708d212",
//       PAGE_ACCESS_TOKEN :  "EAAYwPrsj1ZA0BAORAoGhxvLLs5eRZADJ8BheTdjOXu8lT0X2tVFwZAZCEJiWFenFHCVqSuctfONET6dhbPDBnlivq5sXEvBABTnRlYpX8hLxZAnO2lywRiA6sVlbYAvG1n1EpQwkVhZAdrmq1p9PlQRUu327O1ohcZBwVLYZCn3beQZDZD",
//       VALIDATION_TOKEN : "my_voice_is_my_password_verify_me"
//     }
//   },
//
//   nh: {
//     kakao: {
//       keyboard: {
//         type: "buttons",
//         buttons: ["상품안내", "FAQ (자주 묻는 질문)", "이벤트안내", "이용시간안내", "올원뱅크 바로가기"]
//       }
//     },
//     dialogServer: {chatScript: true}
//   }
//
// };

//1094114534004265 장세영
//1006864529411088 배달봇
//997804450331458  장세영 테스트

// var messages = {
//   // typeExit: '\n처음으로 돌아가기: \'ㄱ\'',
//   typeExit: '',
//   typeAddress: '주소 형식이 틀렸습니다.',
//   typeAddressCheck1: '입력하신 주소가 없습니다.',
//   yesRegExp: "응|그래|네|그렇다|오케이|예스|ㅇㅋ|ㅇㅇ|OK|ok|Ok|YES|yes|Yes|sp|SP",
//   noRegExp: "아니다|싫다|않다|노|NO|no|No",
//   userError: '일시적 오류가 발생하였습니다.\n\n불편을 드려 죄송합니다.\n\n"시작"을 입력하여 처음부터 다시 시작해 주세요'
// };
//
// exports.messages = messages;

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

// global._context = {
//   concepts: {
//     '네': ['응', '그래', '네', '그렇다', '오케이', '예스', 'ㅇㅋ', 'ㅇㅇ', 'OK', 'ok', 'Ok', 'YES', 'yes', 'Yes', 'sp', 'SP'],
//     '아니요': ['아니다', '싫다', '않다', '노', 'ㄴㄴ', 'NO', 'no', 'No'],
//     '변경' : ['바꾸다', '틀리다'],
//     '시작' : ['처음', ':reset user']
//   }
// };
