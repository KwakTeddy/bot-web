var net = require('net');
var path = require('path');
var moneybot = require('../controllers/moneybot.server.controller');
var botProcess = require('../controllers/_action.server.controller');
var tough = require('tough-cookie');
var _ = require('lodash');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser');

exports.write = function(from, to, text, successCallback, errorCallback, endCallback) {

    botProc(to, from, text, successCallback, chatSocketConfig);

};

exports.botProc = botProc;

function botProc(botName, user, inTextRaw, outCallback, chatServerConfig) {

  var context = getContext(botName, user);

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
        context.user.pendingCallback(inTextRaw, inTextNLP, inDoc, print, print);
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
  // typeExit: '\n처음으로 돌아가기: \'ㄱ\'',
  typeExit: '',
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
