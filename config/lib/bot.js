var config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  utils = require(path.resolve('modules/bot/action/common/utils'));

function buildBot(botName) {
  var build = require(path.resolve('modules/bot/action/common/build.js'));
  build.botBuild(botName);
  console.log('Bot Build: ' + botName);
}

exports.buildBot = buildBot;

function loadBots() {
  console.log("Load Bots: START");
  var botDir = path.resolve('custom_modules');
  var fileFilter = function(file) { return fs.lstatSync(path.join(botDir, file)).isDirectory(); };

  var files;
  try {
    files = fs.readdirSync(botDir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(fileFilter);
  } catch(e) {
    console.log('loadBot: ' + botDir + ' 경로 없음 ' + e);
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var dir = files[i];
    loadBot(dir);
  }

  console.log("Load Bots: END");
}

exports.loadBots = loadBots;

function loadBot(botName) {
  var botDir = path.resolve('custom_modules/' + botName);
  var fileFilter = function(file) { return file.endsWith('bot.js'); };

  var files;
  try {
    files = fs.readdirSync(botDir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(fileFilter);
  } catch(e) {
    console.log('loadBot: ' + botDir + ' 경로 없음');
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var filePath = path.join(botDir, file);

    utils.requireNoCache(filePath);
  }


  fileFilter = function(file) { return file.endsWith('dialog.js'); };

  try {
    files = fs.readdirSync(botDir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(fileFilter);
  } catch(e) {
    console.log('loadBot: ' + botDir + ' 경로 없음');
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var filePath = path.join(botDir, file);

    utils.requireNoCache(filePath);
  }
}

exports.loadBot = loadBot;


function setBot(botName, bot) {
  if(!global._bots) global._bots = {};
  global._bots[botName] = bot;
  global._bots[botName].dialogs = [];
  global._bots[botName].globalDialogs = [];

  console.log('Bot Load: ' + botName);

}

exports.setBot = setBot;


function setDialogs(botName, dialogs) {
  global._bots[botName].dialogs = global._bots[botName].dialogs.concat(dialogs);
}

exports.setDialogs = setDialogs;


function setGlobalDialogs(botName, dialogs) {
  global._bots[botName].globalDialogs = global._bots[botName].globalDialogs.concat(dialogs);
}

exports.setGlobalDialogs = setGlobalDialogs;
