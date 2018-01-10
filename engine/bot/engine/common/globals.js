var path = require('path');
var fs = require('fs');
var utils = require(path.resolve('engine/bot/action/common/utils'));

exports.initGlobals = function() {
  console.log('Load Global: [START]');

  if(!global._context) global._context = {};
  if(!global._bots) global._bots = {};
  if(!global._userbots) global._userbots = {};
  if(!global._channels) global._channels = {};
  if(!global._users) global._users = {};
  if(!global._botusers) global._botusers = {};
  if(!global._templates) global._templates = {};

  if(!global._context.dialogs) global._context.dialogs = {};
  if(!global._context.commonDialogs) global._context.commonDialogs = {};
  if(!global._context.tasks) global._context.tasks = {};
  if(!global._context.actions) global._context.actions = {};
  if(!global._context.types) global._context.types = {};
  if(!global._context.typeChecks) global._context.typeChecks = {};
  if(!global._context.concepts) global._context.concepts = {};
  if(!global._context.messages) global._context.messages = {};

  require(path.resolve('engine/bot/action/common/type'));
  loadGlobals(path.resolve('engine/bot/global'));
  loadGlobals(path.resolve('engine/global'));
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

