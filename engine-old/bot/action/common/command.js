var path = require('path');
var bot = require(path.resolve('./engine2/bot.js'));
var dialog = require(path.resolve('engine2/bot/action/common/dialog'));
var contextModule = require(path.resolve('engine2/bot/engine/common/context'));
var utils = require(path.resolve('engine2/bot/action/common/utils'));

function command(inTextRaw, inTextNLP, context, print, callback) {
  var cmd = inTextRaw.trim();
  var startDialog;
  if(cmd.startsWith(':build')) {
    if(context.bot.template && context.bot.template.id) {
      bot.buildBot(context.bot.template.id, context.bot.path);
    } else {
      bot.buildBot(context.bot.botName, context.bot.path);
    }
      // message = 'build ' + context.bot.botName + ' completed!\n';

      console.log('리빌드합니다');

      bot.loadBot(context.bot.botName, function(_bot) {
        // message += 'load ' + context.bot.botName + ' completed!\n';

        startDialog = dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

        if(!startDialog)
          print('안녕하세요.' + (context.bot.name || context.botUser.curBotName) + '입니다.');
        // print('시작 Dialog가 없습니다.');
        else
          dialog.executeDialog(startDialog, context, print, callback);
      });
  } else if(cmd.startsWith(':viewGraph')) {
    if(context.bot.template && context.bot.template.id) {
      bot.buildBot(context.bot.template.id, context.bot.path);
    } else {
      bot.buildBot(context.bot.botName, context.bot.path);
    }
      // message = 'build ' + context.bot.botName + ' completed!\n';

      bot.loadBot(context.bot.botName, function(_bot) {
        // message += 'load ' + context.bot.botName + ' completed!\n';

        startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

        if(!startDialog)
          print('안녕하세요.' + context.bot.name + '입니다.');
        // print('시작 Dialog가 없습니다.');
        else
          dialog.executeDialog(startDialog, context, print, callback);
      });
  } else if(cmd == ':reset user') {
    //TODO 디버깅 시에 서버 재시작 안하고 로딩
    // utils.requireNoCache(path.resolve('engine2/bot/engine/common/globals')).initGlobals();
    // utils.requireNoCache(path.resolve('engine2/bot/action/common/dialog'));
    // utils.requireNoCache(path.resolve('engine2/bot/action/common/task'));
    // utils.requireNoCache(path.resolve('engine2/bot/action/common/type'));

    context.botUser.topic = null;

    startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);
    if(!startDialog)
      print('안녕하세요.' + (context.bot.name || context.botUser.curBotName) + '입니다.');
      // print('시작 Dialog가 없습니다.');
    else
      dialog.executeDialog(startDialog, context, print, callback);
  }
  else if(cmd == ':reset memory')
  {
      context.user = {};
      console.log('리셋 메모리');

      startDialog = dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

      if(!startDialog)
          print('안녕하세요.' + (context.bot.name || context.botUser.curBotName) + '입니다.');
      // print('시작 Dialog가 없습니다.');
      else
          dialog.executeDialog(startDialog, context, print, callback);
  }
}

exports.command = command;

function buildBot(task, context, callback) {
  callback(task, context);
}

exports.buildBot = buildBot;


function resetUser(task, context, callback) {
  context.botUser.currentDialog = null;
  context.user.pendingCallback = null;

  callback(task, context);
}

exports.resetUser = resetUser;

exports.changeBot = changeBot;

var mongoose = require('mongoose');
var UserBot = mongoose.model('UserBot');

function changeBot(task, context, callback) {
  /*if(context.channel.name != 'socket') */{
    context.botUser.curBotId = task.botId;
    context.botUser.curBotName = task.botName;
  }

  var botName = task.botId;

  console.log('changeBot: ' + botName);
  contextModule.getBotContext(botName, function(_botContext) {
    context.bot = _botContext;

    var startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

    if(!startDialog) {
      task.output = '안녕하세요.' + context.bot.name + '입니다.';
    } else if (typeof startDialog.output != 'string'){
      task.output = '안녕하세요.' + context.bot.name + '입니다.';
    } else {
      task.output = startDialog.output;
    }

    UserBot.findOne({id: botName}).lean().exec(function (err, userBot) {
      if (err) {
        console.log(err)
      } else if (userBot) {
        task.outputtext = task.output;
        var json = {text: task.output, bot: userBot};
        task.output = JSON.stringify(json);
      } else {
        task.outputtext = task.output;
      }

      callback(task, context);
    });

  });
}
