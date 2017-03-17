var path = require('path');
var bot = require(path.resolve('config/lib/bot'));
var dialog = require(path.resolve('modules/bot/action/common/dialog'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

function command(inTextRaw, inTextNLP, context, print, callback) {
  var cmd = inTextRaw.trim();
  var startDialog;
  if(cmd.startsWith(':build')) {
      bot.buildBot(context.bot.botName);
      // message = 'build ' + context.bot.botName + ' completed!\n';

      bot.loadBot(context.bot.botName);
      // message += 'load ' + context.bot.botName + ' completed!\n';

      startDialog = dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

    if(!startDialog)
      print('안녕하세요.' + context.bot.name + '입니다.');
      // print('시작 Dialog가 없습니다.');
    else
      dialog.executeDialog(startDialog, context, print, callback);
  } else if(cmd.startsWith(':viewGraph')) {
      bot.buildBot(context.bot.botName);
      // message = 'build ' + context.bot.botName + ' completed!\n';

      bot.loadBot(context.bot.botName);
      // message += 'load ' + context.bot.botName + ' completed!\n';

      startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

    if(!startDialog)
      print('안녕하세요.' + context.bot.name + '입니다.');
      // print('시작 Dialog가 없습니다.');
    else
      dialog.executeDialog(startDialog, context, print, callback);

  } else if(cmd == ':reset user') {
    startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

    if(!startDialog)
      print('안녕하세요.' + context.bot.name + '입니다.');
      // print('시작 Dialog가 없습니다.');
    else
      dialog.executeDialog(startDialog, context, print, callback);
  } else if(cmd.indexOf(':change') == 0) {
    var commands = cmd.split(' ');
    if(commands.length > 1) {
      context.botUser.curBotName = commands[1];

      contextModule.getBotContext(context.botUser.curBotName, function(_botContext) {
        context.bot = _botContext;

        startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

        if(!startDialog)
          print('안녕하세요.' + context.bot.name + '입니다.');
        else
          print(startDialog.output);
      });
    } else {
      print('봇을 찾을 수 없습니다.');
    }
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

function changeBot(task, context, callback) {
  context.botUser.curBotName = task.botName;

  contextModule.getBotContext(context.botUser.curBotName, function(_botContext) {
    context.bot = _botContext;

    var startDialog= dialog.findDialog(null, context, dialog.START_DIALOG_NAME);

    task.output = startDialog.output;
    callback(task, context);
  });
}