var path = require('path');
var bot = require(path.resolve('config/lib/bot'));
var dialog = require(path.resolve('modules/bot/action/common/dialog'));

function command(inTextRaw, inTextNLP, context, print, callback) {
  var cmd = inTextRaw.trim();
  var startDialog;
  if(cmd.startsWith(':build')) {
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
