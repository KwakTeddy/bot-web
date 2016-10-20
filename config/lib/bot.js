var config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  utils = require(path.resolve('modules/bot/action/common/utils')),
  _ = require('lodash');

function buildBot(botName) {
  console.log('Building Bot: ' + botName);

  var build = utils.requireNoCache(path.resolve('modules/bot/action/common/build'));
  build.botBuild(botName);
}

exports.buildBot = buildBot;

function loadBots() {
  console.log('');
  console.log("Load Bots: [START]");
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

    buildBot(dir);
    loadBot(dir);
  }

  console.log("Load Bots: [END]");
}

exports.loadBots = loadBots;

function loadBot(botName) {
  console.log('Loading Bot: ' + botName);
  var botDir = path.resolve('custom_modules/' + botName);
  var fileFilter = function(file) { return file.endsWith('.bot.js'); };

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

    console.log('\tloading file: ' + file);
    utils.requireNoCache(filePath);
  }


  var bot = getBot(botName);
  if(bot && bot.dialogFiles) {
    for (var i = 0; i < bot.dialogFiles.length; i++) {
      var file = bot.dialogFiles[i];
      var filePath = path.join(botDir, file);

      try {
        console.log('\tloading file: ' + file);

        utils.requireNoCache(filePath);
      } catch(e) {
        console.log('\tloading file: ' + file + ' error or not found');
        console.error(e);
      }
    }
  }

  fileFilter = function(file) {
    if(bot && bot.dialogFiles && _.includes(bot.dialogFiles, file)) return false;
    else return file.endsWith('.dialog.js');
  };

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

    try {
      console.log('\tloading file: ' + file);

      utils.requireNoCache(filePath);
    } catch(e) {
      console.error(e);
    }
  }


  fileFilter = function(file) {
    if(bot && bot.dialogFiles && _.includes(bot.dialogFiles, file)) return false;

    else if(file.endsWith('.js') && !file.endsWith('.dialog.js') && !file.endsWith('.bot.js')) {
      // var jsPath = path.resolve('custom_modules/' + botName + '/' + file);
      // var info = path.parse(jsPath);
      // var dlgPath = path.resolve('custom_modules/' + botName + '/' + info.name + '.dlg');
      //
      // if(fs.existsSync(dlgPath)) return false;
      // else
        return true;
    } else {
      return false;
    }

  };

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
    console.log(e);
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var filePath = path.join(botDir, file);

    try {
      console.log('\tloading file: ' + file);

      utils.requireNoCache(filePath);
    } catch(e) {
      console.error(e);
    }
  }
}

exports.loadBot = loadBot;


// function setBot(botName, bot) {
//   if(!global._bots) global._bots = {};
//   global._bots[botName] = bot;
//   global._bots[botName].dialogs = [];
//   global._bots[botName].commonDialogs = [];
//   global._bots[botName].tasks = {};
//   global._bots[botName].actions = {};
//   global._bots[botName].types = {};
//   global._bots[botName].typeChecks = {};
//   // console.log('SetBot: ' + botName);
// }
//
// exports.setBot = setBot;
//
// function setDialogs(botName, dialogs) {
//   global._bots[botName].dialogs = global._bots[botName].dialogs.concat(dialogs);
// }
//
// exports.setDialogs = setDialogs;
//
//
// function setCommonDialogs(botName, dialogs) {
//   global._bots[botName].commonDialogs = global._bots[botName].commonDialogs.concat(dialogs);
// }
//
// exports.setCommonDialogs = setCommonDialogs;
//
//
// function setTask(botName, taskName, task) {
//   global._bots[botName].tasks[taskName] =  task;
// }
//
// exports.setTask = setTask;
//
// function setAction(botName, actionName, action) {
//   global._bots[botName].actions[actionName] =  action;
// }
//
// exports.setAction = setAction;
//
//
// function setTypeCheck(botName, typeCheckName, typeCheck) {
//   global._bots[botName].typeChecks[typeCheckName] =  typeCheck;
// }
//
// exports.setTypeCheck = setTypeCheck;

exports.initGlobals = function() {
  console.log('Load Global: [START]');

  if(!global._context) global._context = {};
  if(!global._bots) global._bots = {};
  if(!global._channels) global._channels = {};
  if(!global._users) global._users = {};
  if(!global._botusers) global._botusers = {};

  if(!global._context.dialogs) global._context.dialogs = {};
  if(!global._context.commonDialogs) global._context.commonDialogs = {};
  if(!global._context.tasks) global._context.tasks = {};
  if(!global._context.actions) global._context.actions = {};
  if(!global._context.types) global._context.types = {};
  if(!global._context.typeChecks) global._context.typeChecks = {};
  if(!global._context.concepts) global._context.concepts = {};
  if(!global._context.messages) global._context.messages = {};

  loadGlobals(path.resolve('modules/bot/global'));
  console.log('Load Global: [END]');
};

function loadGlobals(dir) {
  var fileFilter = function(file) { return file.endsWith('.js') || fs.lstatSync(path.join(dir, file)).isDirectory(); };

  var files;
  try {
    files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(fileFilter);
  } catch(e) {
    console.log('loadBot: ' + dir + ' 경로 없음 ' + e);
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if(file.endsWith('.js')) {
      utils.requireNoCache(path.join(dir, file));
      console.log('\tloading file: ' + file);
    } else if(fs.lstatSync(path.join(dir, file)).isDirectory()) {
      loadGlobals(path.join(dir, file));
    }
  }
}

function setGlobalDialogs(dialogs) {
  global._context.dialogs = global._context.dialogs.concat(dialogs);
}

exports.setGlobalDialogs = setGlobalDialogs;


function setGlobalCommonDialogs(dialogs) {
  global._context.commonDialogs = global._context.commonDialogs.concat(dialogs);
}

exports.setGlobalCommonDialogs = setGlobalCommonDialogs;

function setGlobalTask(taskName, task) {
  task.name = taskName;
  global._context.tasks[taskName] =  task;
}

exports.setGlobalTask = setGlobalTask;

function setGlobalAction(actionName, action) {
  global._context.actions[actionName] =  action;
}

exports.setGlobalAction = setGlobalAction;


function setGlobalType(typeName, type) {
  type.name = typeName;
  global._context.types[typeName] =  type;
}

exports.setGlobalType = setGlobalType;

function setGlobalTypeCheck(typeCheckName, typeCheck) {
  global._context.typeChecks[typeCheckName] =  typeCheck;
}

exports.setGlobalTypeCheck = setGlobalTypeCheck;

function setGlobalConcepts(concepts) {
  for (var key in concepts) {
    global._context.concepts[key] = concepts[key];
  }
}

exports.setGlobalConcepts = setGlobalConcepts;

function setGlobalMessages(messages) {
  for (var key in messages) {
    global._context.messages[key] = messages[key];
  }
}

exports.setGlobalMessages = setGlobalMessages;

function Bot(schema) {
  utils.merge(this, schema);

  this.dialogs = this.dialogs || [];
  this.commonDialogs = this.commonDialogs || [];
  this.tasks = this.tasks || {};
  this.actions = this.actions || {};
  this.types = this.types || {};
  this.typeChecks = this.typeChecks || {};
  this.concepts = this.concepts || {};
  this.messages = this.messages || {};
}

exports.Bot = Bot;

Bot.prototype.setDialogs = function(dialogs) {
  this.dialogs = this.dialogs.concat(dialogs);
};

Bot.prototype.setCommonDialogs = function(dialogs) {
  this.commonDialogs = this.commonDialogs.concat(dialogs);
};

Bot.prototype.setTask = function(taskName, task) {
  task.name = taskName;
  this.tasks[taskName] = task;
};

Bot.prototype.setAction = function(actionName, action) {
  this.actions[actionName] = action;
};

Bot.prototype.setType = function(typeName, type) {
  type.name = typeName;
  this.types[typeName] = type;
};

Bot.prototype.setTypeCheck = function(typeCheckName, typeCheck) {
  this.typeChecks[typeCheckName] = typeCheck;
};

Bot.prototype.setConcepts = function(concepts) {
  for (var key in concepts) {
    this.concepts[key] = concepts[key];
  }
};

Bot.prototype.setMessages = function(messages) {
  for (var key in messages) {
    this.messages[key] = messages[key];
  }
};

function makeBot(botName, schema) {
  var bot = new Bot(schema);
  global._bots[botName] = bot;

  // console.log('MakeBot: ' + botName);

  return bot;
}

exports.makeBot = makeBot;

function getBot(botName) {
  return global._bots[botName];
}

exports.getBot = getBot;

