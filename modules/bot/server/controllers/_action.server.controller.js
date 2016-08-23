'use strict'

var path = require('path');
var taskModule = require(path.resolve('./modules/bot/action/common/task'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var utils = require(path.resolve('./modules/bot/action/common/utils'));

exports.processChatserverOut = function (context, outText, inText, _inText, inDoc, successCallback, errorCallback) {
  var task = null;
  var out = null;

  outText = type.chatserverEscape(outText);

  try {
    task = JSON.parse(outText);
  } catch (e) {
    if(outText.startsWith("{")) {
      console.log("acton.server.controller:execute>> Task JSON 포맷 오류\n" + e);
      console.log(outText);
    }
    return;
  }

  if (task && typeof task == 'object') {
    out = task.content;

    task = utils.merge(task, inDoc);
    task.in = inText;
    task._in = _inText;
    task.out = out;

    task.topSuccessCallback = successCallback;

    taskModule.executeTask(task, context, function(_task, _context) {
      if(typeof _task.buttons === "string") {
        _task.buttons = type.processButtons(_task, _context, _task.buttons);
      }

      if(successCallback) successCallback(type.processOutput(_task, _context, out), _task, _context);
    }, function(error, _task, _context) {
      if(errorCallback) errorCallback(error, _task, _context);
      else console.log("execAction:" + _task.module + "." + _task.action + ": error: " + error);
    });
  } else {
    task = {};
    task.in = inText;
    task._in = _inText;
    task.doc = inDoc;
    out = outText;

    if(successCallback) successCallback(type.processOutput(task, context, out));
  }
}

exports.processIn = function(botName, user, text, successCallback, errorCallback) {

  type.processInput(botName, user, text, function(_text, inDoc){
    findTask(botName, user, _text, function(task) {
      task.in = _text;
      task.doc = inDoc;

      taskModule.execute(task, context, successCallback, errorCallback);
    });
  });
}


