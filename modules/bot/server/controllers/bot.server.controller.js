var net = require('net');
var path = require('path');
var botProcess = require('../controllers/_action.server.controller');
var tough = require('tough-cookie');
var _ = require('lodash');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));

var async = require('async');

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = write;
function write(channel, from, to, text, successCallback, errorCallback, endCallback) {
    botProc(to, channel, from, text, successCallback, chatSocketConfig);
};

exports.botProc = botProc;

function botProc(botName, channel, user, inTextRaw, outCallback, chatServerConfig) {

  getContext(botName, channel, user, function(_context) {
    var context = _context;

    logger.verbose("사용자 입력>> " + inTextRaw);

    var type = utils.requireNoCache(path.resolve('./modules/bot/action/common/type'));

    type.processInput(context, inTextRaw, function(inTextNLP, inDoc) {
      logger.verbose("자연어 처리>> " + inTextNLP);

      var print = function(_out, _task) {
        logger.verbose("사용자 출력>> " + _out + "\n");

        if(_task && _task.photoUrl && !_task.photoUrl.startsWith('http')) {
          //_task.photoUrl = config.host + (config.port ? ':' + config.port : '') + _task.photoUrl;
          _task.photoUrl = (process.env.HTTP_HOST ? process.env.HTTP_HOST : '') + _task.photoUrl;
        }

        outCallback(_out, _task);
      };

      if(context.user.pendingCallback) {
        if(inTextRaw.search(/(처음|메뉴)/g) != -1 || inTextRaw.startsWith(':')) {
          context.user.pendingCallback = null;
          context.user.pendingType = null;

        } else {
          context.user.pendingCallback(inTextRaw, inTextNLP, inDoc, context, print, print);
          return;
        }
      }

      var chatscriptSocket = net.createConnection(chatServerConfig, function(){
        chatscriptSocket.write(user+'\x00'+ /*botName*/ '' +'\x00'+inTextNLP+'\x00');
      });

      chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
        var chatserverOut = data.toString();

        logger.verbose("챗서버 답변>> " + chatserverOut);

        botProcess.processChatserverOut(context, chatserverOut, inTextNLP, inTextRaw, inDoc, print, print)
      });

      chatscriptSocket.on('end', function() {       // on end from chatscriptSocket
        console.log('disconnected from server');
      });

      chatscriptSocket.on('error', function(err) {  // on error from chatscriptSocket
        console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
      });

    })
  });
}

exports.getContext = getContext;
function getContext(botName, channel, user, callback) {
  if(!global._context) global._context = {};
  if(!global._bots) global._bots = {};
  if(!global._channels) global._channels = {};
  if(!global._users) global._users = {};

  var userContext;

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
          global._users[user] = userContext;
          cb(null);
        });
      } else {
        userContext = global._users[user];
        cb(null);
      }
    }
  ], function(err) {
    var context = {
      global: global._context,
      bot: global._bots[botName],
      channel: global._channels[channel],
      user: userContext
    };

    context.bot.botName = botName;
    context.channel.name = channel;
    context.user.userId = user;

    if(!context.user.cookie) context.user.cookie = new tough.CookieJar();

    context.global.messages = messages;

    // context.user.mobile = '010-6316-5683';

    callback(context);
  });

}


global._bots = {
  order: {
    kakao: {
      keyboard: { type :"buttons", buttons:["배달주문하기", "배달내역보기"]}
    },
    facebook: {
      id: '1006864529411088',
      APP_SECRET :  "eb2974959255583150013648e7ac5da4",
      PAGE_ACCESS_TOKEN :  "EAAJGZBCFjFukBAE63miCdcKFwqTEmbbhSbm6jIr6ws5I7fKnWSMUqIzGfHZBDTqmW0wra5xZBZCLWg2O9miPcc6WdVQRyfHdDCYuhLjIbng0njUHqOdbasHcSZAs2WEO7zG72wgmciNsF138QCq1vLnzMHR3XYIP0VnV1iZBsZAngZDZD",
      VALIDATION_TOKEN : "moneybrain_token"
    },
    managers: [
      {platform: 'facebook', userId: '1094114534004265', name: '장세영'},
      {platform: 'facebook', userId: '997804450331458', name: '테스트'}
      //100013440439602

      //10068645294110881006864529411088
    ],

    messages: {
      manager:  false,
      orderCall: false
    }
  },
  moneybot: {
    kakao: {
      keyboard: { type :"buttons", buttons:["잔액조회", "상품추천", "고객상담"]}
    },
    facebook: {
      APP_SECRET :  "174b2a851e3811c3f2c267d46708d212",
      PAGE_ACCESS_TOKEN :  "EAAYwPrsj1ZA0BAORAoGhxvLLs5eRZADJ8BheTdjOXu8lT0X2tVFwZAZCEJiWFenFHCVqSuctfONET6dhbPDBnlivq5sXEvBABTnRlYpX8hLxZAnO2lywRiA6sVlbYAvG1n1EpQwkVhZAdrmq1p9PlQRUu327O1ohcZBwVLYZCn3beQZDZD",
      VALIDATION_TOKEN : "my_voice_is_my_password_verify_me"
    }
  }

};

//1094114534004265 장세영
//1006864529411088 배달봇
//997804450331458  장세영 테스트

var messages = {
  // typeExit: '\n처음으로 돌아가기: \'ㄱ\'',
  typeExit: '',
  typeAddress: '주소 형식이 틀렸습니다.',
  typeAddressCheck1: '입력하신 주소가 없습니다.',
  yesRegExp: "응|그래|네|그렇다|오케이|예스|ㅇㅋ|ㅇㅇ|OK|ok|Ok|YES|yes|Yes|sp|SP",
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
