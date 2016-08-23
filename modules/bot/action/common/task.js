var utils = require('./utils');

const MAX_ACTION = 100;

exports.executeTask = executeTask;

function executeTask(task, context, successCallback, errorCallback) {
  var taskModule = findModule(task, context);

  if(!task.topTask) task.topTask = task;

  if(taskModule) {
    if(task.paramDefs) {
      for(var i = 0; i < task.paramDefs.length; i++) {
        if(!task[task.paramDefs[i].name]) {
          context.user.pendingCallback = function(_text) {
            task[task.paramDefs[i].name] = _text;

            context.user.pendingCallback = null;
            context.user.pendingType = null;
            executeTask(task, context, successCallback, errorCallback);
          };

          context.user.pendingType = task.paramDefs[i].type;

          if(task.topSuccessCallback) task.topSuccessCallback(task.paramDefs[i].question);
          return;
        }
      }
    }

    var _successCallback = function(task, context) {
      if(task.postCallback) {
        task.postCallback(task, context, function(_task, _context) {
          if(successCallback) successCallback(_task, _context);
        });
      } else {
        if(successCallback) successCallback(task, context);
      }
    };

    console.log('executeTask: ' + task.module + '.' + task.action);

    if(task.preCallback) {
      task.preCallback(task, context, function(_task, _context) {
        taskModule.execute(_task, _context, _successCallback, errorCallback);
      });
    } else {
      taskModule.execute(task, context, _successCallback, errorCallback);
    }

    return true;
  } else {
    errorCallback(new Error('Module not exist.'), task, context);
    return false;
  }
}


exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {
  if(task.action == 'sequence' || task.action == 'repeat') {
    var taskCounter = 0;
    var taskNum = 0;
    var curTask = task.actions[taskNum];

    var _successCallback = function(_task, _context) {
      var docMerge = curTask.docMerge;

      if (Array.isArray(_task.doc)) {
        if (!task.doc) task.doc = [];
        if (docMerge != 'none') task.doc = task.doc.concat(_task.doc);
      } else {
        if (docMerge == 'add') {
          if (!task.doc) task.doc = [];
          task.doc = task.doc.concat(_task.doc);
        }
        else if (docMerge == 'out') task = utils.merge(task, _task.doc);
        else if (docMerge == 'replace') task.doc = _task.doc;
        else task.doc = utils.merge(task.doc, _task.doc);
      }

      taskCounter++;

      _executeTask(curTask, _context, _successCallback, errorCallback);
    };

    var _executeTask = function(_task, _context, __successCallback, errorCallback) {
      if (task.action == 'sequence' && (taskNum = taskCounter) >= task.actions.length) {

        successCallback(task, context);
      } else if (task.action == 'repeat' &&
        ((typeof _task.condition == 'string' && !eval(_task.condition)) ||
        (_task.condition instanceof Function && !_task.condition(_task, _context)) ||
        taskCounter >= task.taskLimit || taskCounter >= MAX_ACTION)) {

        successCallback(task, context);
      } else {
        curTask = task.actions[taskNum];
        curTask.parent =  task;
        curTask.topTask = task.topTask;

        if (curTask.setData) curTask.doc = _task.doc;

        executeTask(curTask, _context, __successCallback, errorCallback);
      }
    };

    _executeTask(curTask, context, _successCallback, errorCallback);

  } else if(task.action == 'if') {

    for(var i =0; i < task.actions.length; i++) {
      var curTask = task.actions[i];
      curTask.parent =  task;
      curTask.topTask = task.topTask;

      if(curTask.condition) {
        if((typeof curTask.condition == 'string' && eval(curTask.condition)) ||
          (curTask.condition instanceof Function && curTask.condition(curTask, context)))
        {
          executeTask(curTask, context, successCallback, errorCallback);
          return;
        }
      }
    }

    successCallback(task, context);

  } else if(task.action == 'synchronous') {

    var taskCounter = 0;
    var docs =[];

    var _successCallback = function(_task, _context) {
      if(++taskCounter >= task.actions.length) {
        _task.doc = docs;

        task.joinder(_task, function(__task, __context) {
          successCallback(__task, __context);
        });

      } else {
        docs.push(_task.doc);
      }
    };

    for(var i = 0; i < task.actions.length; i++) {
      var curTask = task.actions[i];
      curTask.parent =  task;
      curTask.topTask = task.topTask;

      executeTask(curTask, context, _successCallback, errorCallback);
    }
  }
}

exports.findModule = findModule;

function findModule(task, context) {
  var taskModule;
  var botName = context.bot.botName;

  if(!task.module) {
    // bot action
    try {
      taskModule = require('../../../../custom_modules/' + botName + '/' + botName);
    } catch(err) {
      //console.log("error loading custom module: " + botName + "/" + botName);
    }
  } else {
    //template action
    var templateModule;
    try {
      templateModule = require('../../../../custom_modules/' + botName + '/' + task.module);

      if(templateModule) {
        if(templateModule[task.action]) {
          //var template = utils.clone(templateModule[task.action]);
          var template = templateModule[task.action];
          task.templateAction = task.action;
          task.module = template.module;
          task.action = template.action;
          task = utils.merge(task, template);
          task.template = template;

          taskModule = require('../../action/common/' + task.module);

        } else {
          taskModule = templateModule;
        }
      }
    } catch(err) {
      // console.log("error loading custom module: " + botName + "/" + task.module + '/' + task.action);
      // console.log(err);
    }

    // common action
    if(!taskModule) {
      try {
        taskModule = require('../../action/common/' + task.module);
      } catch(err) {
        // console.log("error loading common module: " + task.module);
        // console.log(err);
      }
    }
  }

  return taskModule;
}
