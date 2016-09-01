var utils = require('./utils');

const MAX_ACTION = 100;

exports.executeTask = executeTask;

function executeTask(task, context, successCallback, errorCallback) {
  if(task == undefined) throw new Error('task.js:executeTask: Wrong arguments. task undefined');
  if(context == undefined) throw new Error('task.js:executeTask: Wrong arguments. context undefined ' + task.module + '.' + task.action);
  if(successCallback == undefined) throw new Error('task.js:executeTask: Wrong arguments. successCallback undefined' + task.module + '.' + task.action);

  var taskModule = findModule(task, context);

  if(!task.topTask) task.topTask = task;

  if(taskModule) {
    // condition false 면 bypass
    var fCondition = (typeof task.condition == 'string' && !eval(task.condition)) ||
        (task.condition instanceof Function && !task.condition(task, context));

    var _successCallback = function(task, context) {
      if(task.postCallback) {
        task.postCallback(task, context, function(_task, _context) {
          if(!_task || !_context) throw new Error('task.js:executeTask: wrong postCallback. In ' + task.module + '.' + task.action + ', Check callback(task, context)');

          if(_task.taskOut) {
            var type = utils.requireNoCache('./type');
            _task.topTask.topSuccessCallback(type.processOutput(_task, _context, _task.taskOut));
          }

          if(successCallback) successCallback(_task, _context);
        });
      } else {
        if(task.taskOut) {
          var type = utils.requireNoCache('./type');
          task.topTask.topSuccessCallback(type.processOutput(task, _context, task.taskOut));
        }

        if(successCallback) successCallback(task, context);
      }
    };

    // console.log('executeTask: ' + task.module + '.' + task.action);

    var _call = function() {
      if(task.preCallback) {
        task.preCallback(task, context, function(_task, _context) {
          if(!_task || !_context) throw new Error('task.js:executeTask: wrong preCallback. In ' + task.module + '.' + task.action + ', Check callback(task, context)');

          if(fCondition) {
            _successCallback(task, context);
          } else if(taskModule[task.action] instanceof Function) {
            taskModule[task.action](_task, _context, _successCallback, errorCallback);
          } else if(taskModule.execute instanceof Function) {
            taskModule.execute(_task, _context, _successCallback, errorCallback);
          } else {
            errorCallback(new Error('task.js:executeTask: Function not exist ' + task.module + '.' + task.action), task, context);
          }
        });
      } else {
        if(fCondition) {
          _successCallback(task, context);
        } else if(taskModule[task.action] instanceof Function) {
          taskModule[task.action](task, context, _successCallback, errorCallback);
        } else if(taskModule.execute instanceof Function) {
          taskModule.execute(task, context, _successCallback, errorCallback);
        } else {
          errorCallback(new Error('task.js:executeTask: Function not exist ' + task.module + '.' + task.action), task, context);

        }
      }
    };

    if(task.paramDefs && !fCondition) {
      var type = utils.requireNoCache('./type');

      for(var i = 0; i < task.paramDefs.length; i++) {
        var paramDef = task.paramDefs[i];
        if(task[paramDef.name] == undefined) {

          // 디폴트 값 user context 에서 가져오기
          if(context.user[paramDef.name]) {
            paramDef.default = context.user[paramDef.name];
          }

          if(paramDef.default == undefined) {
            context.user.pendingCallback = function(inText, _inText, inDoc) {
              task = utils.merge(task, inDoc);
              task.in = inText;
              task._in = _inText;

              if(task[paramDef.name] == undefined) task[paramDef.name] = _inText;

              context.user.pendingCallback = null;
              context.user.pendingType = null;
              context.user.pendingParamDef = null;

              executeTask(task, context, successCallback, errorCallback);
            };

            context.user.pendingType = paramDef.type;
            context.user.pendingParamDef = paramDef;


            if(paramDef.isDisplay == undefined || paramDef.isDisplay == true) {
              if(task.topSuccessCallback) task.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
              else if(task.topTask.topSuccessCallback) task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
            }

            return;
          } else {
            var paramType = type[paramDef.type+'Type'];
            if(paramType && paramType.typeCheck) {

              paramType.name = paramDef.name;
              paramType.typeCheck(paramDef.default, paramType, task, context, function (_text, _task, matched) {
                paramType.name = paramDef.type;

                if(matched) {
                  if(paramDef.customCheck) {
                    paramDef.customCheck(paramDef.default, paramType, task, context, function (__text, __task, _matched) {
                      if(_matched) {
                        return executeTask(__task, context, successCallback, errorCallback);
                      } else {
                        if(paramType.required) {
                          task.topTask.topSuccessCallback(paramType.required(__text) + '\n' +
                            context.global.messages.typeExit);
                        } else {
                          task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) + '\n' +
                            context.global.messages.typeExit);
                        }
                      }
                    });
                  } else {
                    return executeTask(_task, context, successCallback, errorCallback);
                  }
                } else {
                  if(paramType.required) {
                    task.topTask.topSuccessCallback(paramType.required(_text) + '\n' +
                      context.global.messages.typeExit);
                  } else {
                    task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) + '\n' +
                      context.global.messages.typeExit);
                  }
                }

              });

              return;
            } else {
              if(paramType) {
                errorCallback(new Error('paramDefs type not found. type: ' +
                  paramDef.type + ' name: ' + paramDef.name), task, context);
              } else {
                errorCallback(new Error('paramDefs type typeCheck funtion not found. type: ' + 
                  paramDef.type + ' name: ' + paramDef.name), task, context);
              }

              return false;
            }
          }
        }
      }
    }

     _call();

    return true;
  } else {
    errorCallback(new Error('Module not exist. ' + task.module + '.' + task.action), task, context);
    return false;
  }
}


exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {
  if(task.action == 'sequence' || task.action == 'repeat' || task.action == 'iteration') {
    task.taskCounter = 0;
    var taskNum = 0;
    var curTask = task.actions[taskNum];
    var preTask;

    var _successCallback = function(_task, _context) {
      if(_task.reExecute) {
        _task.reExecute = false;
        executeTask(curTask, _context, _successCallback, errorCallback);
      } else {
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

        task.taskCounter++;

        _executeTask(curTask, _context, _successCallback, errorCallback);
      }
    };

    var _executeTask = function(_task, _context, __successCallback, errorCallback) {
      if (task.action == 'sequence' && (taskNum = task.taskCounter) >= task.actions.length) {

        successCallback(task, context);
      } else if (task.action == 'repeat' &&
        ((typeof _task.condition == 'string' && !eval(_task.condition)) ||
        (_task.condition instanceof Function && !_task.condition(_task, _context)) ||
        task.taskCounter >= task.taskLimit || task.taskCounter >= MAX_ACTION)) {

        successCallback(task, context);
      } else if (task.action == 'iteration' &&
        ((typeof task.condition == 'string' && !eval(task.condition)) ||
        (task.condition instanceof Function && !task.condition(_task, _context)) ||
        task.taskCounter >= task.taskLimit || task.taskCounter >= MAX_ACTION)) {

        successCallback(task, context);
      } else {
       if(task.action == 'iteration') taskNum = task.taskCounter % task.actions.length;

        if(task.taskCounter != 0) preTask = curTask;
        curTask = utils.clone(task.actions[taskNum]);
        curTask.parent =  task;
        curTask.topTask = task.topTask;
        curTask.preTask = preTask;

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
    task.taskCounter = 0;

    var docs =[];

    var _successCallback = function(_task, _context) {
      if(++task.taskCounter >= task.actions.length) {
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
  } else if(task.action == 'question') {
    successCallback(task, context);
  }
}

exports.findModule = findModule;

function findModule(task, context) {
  var taskModule;
  var botName = context.bot.botName;

  //template action
  var templateModule;
  try {
    delete require.cache[require.resolve('../../../../custom_modules/' + botName + '/' + (task.module ? task.module : botName))];
    templateModule = require('../../../../custom_modules/' + botName + '/' + (task.module ? task.module : botName));

    if(templateModule) {
      if(templateModule[task.action] && !(templateModule[task.action] instanceof Function)) {
        //var template = utils.clone(templateModule[task.action]);
        var template = templateModule[task.action];
        task.templateAction = task.action;
        task.module = template.module;
        task.action = template.action;
        task = utils.merge(task, template);
        task.template = template;

        delete require.cache[require.resolve('../../action/common/' + task.module)];
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
      delete require.cache[require.resolve('../../action/common/' + task.module)];
      taskModule = require('../../action/common/' + task.module);
    } catch(err) {
      // console.log("error loading common module: " + task.module);
      // console.log(err);
    }
  }

  return taskModule;
}
