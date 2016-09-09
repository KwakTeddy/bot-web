var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require('./utils');
var async = require('async');
var ifAsync = require('if-async');

const MAX_ACTION = 100;

function executeTask(task, context, successCallback, errorCallback) {
  if(task == undefined) throw new Error('task.js:executeTask: Wrong arguments. task undefined');
  if(context == undefined) throw new Error('task.js:executeTask: Wrong arguments. context undefined ' + task.module + '.' + task.action);
  if(successCallback == undefined) throw new Error('task.js:executeTask: Wrong arguments. successCallback undefined ' + task.module + '.' + task.action);

  logger.debug('');
  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action);

  var taskModule = findModule(task, context);

  if(!task.topTask) task.topTask = task;

  if(taskModule) {
    var fCondition = (typeof task.condition == 'string' && !eval(task.condition)) ||
      (task.condition instanceof Function && !task.condition(task, context));

    if(!fCondition) {

      logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs: CHECK START.');

      var type = utils.requireNoCache('./type');

      // paramDef 체크
      async.each(task.paramDefs, function(paramDef, callbackEach) {

        if(task[paramDef.name] == undefined) {
          var typeText = task.in;
          // 디폴트 값 user context 에서 가져오기
          if(!typeText && context.user[paramDef.name]) paramDef.default = context.user[paramDef.name];
          if(!typeText && paramDef.default) typeText = paramDef.default;

          var paramType = type[paramDef.type+'Type'];
          async.waterfall([
              function(callback) {
                if(typeText && paramType && paramType.typeCheck) {
                  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': typeCheck: ' + typeText);
                  paramType.name = paramDef.type;

                  paramType.typeCheck(typeText, paramType, task, context, function(_text, _task, _matched) {
                    callback(null, _text, _task, _matched);
                  });

                }
                else
                  callback(true, false);
              },

              function(_text, _task, _matched, callback) {
                if(_matched && paramDef.customCheck) {
                  paramDef.customCheck(typeText, paramType, task, context, function(_text, _task, _matched) {
                    callback(null, _text, _task, _matched);
                  });
                }
                else
                  callback(null, _text, _task, _matched);
              }
            ],

            function(err, _text, _task, _matched) {
              logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': ' + (_matched ? 'matched': 'not matched'));

              if(!_matched) {
                if(paramDef.required) {
                  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': pending for user input');

                  context.user.pendingCallback = function (inText, _inText, inDoc) {
                    task = utils.merge(task, inDoc);
                    task.in = inText;
                    task._in = _inText;

                    if (task[paramDef.name] == undefined) task[paramDef.name] = _inText;

                    context.user.pendingCallback = null;
                    context.user.pendingType = null;
                    context.user.pendingParamDef = null;

                    executeTask(task, context, successCallback, errorCallback);
                  };

                  context.user.pendingType = paramDef.type;
                  context.user.pendingParamDef = paramDef;

                  // if(paramDef.isDisplay == undefined || paramDef.isDisplay == true)
                  if (task.topSuccessCallback) task.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
                  else if (task.topTask.topSuccessCallback) task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
                  callbackEach(true);
                }
              } else {
                callbackEach();
              }
            }
          );
        }

      }, function(err) {

        if(err) {
          logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs end with pending');
        } else {
          logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs end');

          // task 비동기 실행
          async.waterfall([
              function(callback) {
                if(task.preCallback) {
                  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback start');

                  task.preCallback(task, context, function(_task, _context) {
                    logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback end');
                    callback(null, _task, _context);
                  });
                } else {
                  callback(null, task, context);
                }
              },

              // ifAsync(function(callback) {
              //   if(task.preCallback) callback(null, true);
              //   else callback(null, false);
              // }).then(function(callback) {
              //   logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback start');
              //
              //   task.preCallback(task, context, function(_task, _context) {
              //     logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback end');
              //     callback(null, _task, _context);
              //   });
              // }).else(function(callback) {
              //   callback(null, task, context);
              // }),

              function(_task, _context, callback) {
                if(!fCondition) {
                  if(taskModule[task.action] instanceof Function) {
                    taskModule[task.action](_task, _context, function(_task, _context) {
                      callback(null, _task, _context);
                    });
                  } else if(taskModule.execute instanceof Function) {
                    taskModule.execute(_task, _context, function(_task, _context) {
                      callback(null, _task, _context);
                    });
                  } else {
                    errorCallback(new Error('task.js:executeTask: Function not exist ' + task.module + '.' + task.action), task, context);
                  }
                } else {
                  callback(null, _task, _context);
                }
              },

              // ifAsync(function(_task, _context, callback) {
              //   if(!fCondition) callback(null, true);
              //   else callback(null, false);
              // }).then(function(_task, _context, callback) {
              //   if(taskModule[task.action] instanceof Function) {
              //     taskModule[task.action](_task, _context, function(_task, _context) {
              //       callback(null, _task, _context);
              //     });
              //   } else if(taskModule.execute instanceof Function) {
              //     taskModule.execute(_task, _context, function(_task, _context) {
              //       callback(null, _task, _context);
              //     });
              //   } else {
              //     errorCallback(new Error('task.js:executeTask: Function not exist ' + task.module + '.' + task.action), task, context);
              //   }
              // }).else(function(_task, _context, callback) {
              //   callback(null, _task, _context);
              // }),

              function(_task, _context, callback) {
                if(task.postCallback) {
                  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback end');
                  task.postCallback(_task, _context, function(_task, _context) {
                    logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback end');
                    callback(null, _task, _context);
                  });
                } else {
                  callback(null, _task, _context);
                }
              }
            
              // ifAsync(function(_task, _context, callback) {
              //   if(task.postCallback) callback(null, true);
              //   else callback(null, false);
              // }).then(function(_task, _context, callback) {
              //   logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback end');
              //   task.postCallback(_task, _context, function(_task, _context) {
              //     logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback end');
              //     callback(null, _task, _context);
              //   });
              // }).else(function(_task, _context, callback) {
              //   callback(null, _task, _context);
              // })
            ],
            function(err, _task, _context) {
              logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' end');

              if(!_task || !_context) throw new Error('task.js:executeTask: wrong postCallback. In ' + task.module + '.' + task.action + ', Check callback(task, context)');

              if(_task.taskOut) {
                var type = utils.requireNoCache('./type');
                _task.topTask.topSuccessCallback(type.processOutput(_task, _context, _task.taskOut));
              }

              if(successCallback) successCallback(_task, _context);
            });

        }
      });

    } else {
      successCallback(task, context);
    }


  } else {
    errorCallback(new Error('task.js:executeTask: Module not exist. ' + task.module + '.' + task.action), task, context);
    return false;
  }
}

exports.executeTask = executeTask;

function _executeTask(task, context, successCallback, errorCallback) {
  if(task == undefined) throw new Error('task.js:executeTask: Wrong arguments. task undefined');
  if(context == undefined) throw new Error('task.js:executeTask: Wrong arguments. context undefined ' + task.module + '.' + task.action);
  if(successCallback == undefined) throw new Error('task.js:executeTask: Wrong arguments. successCallback undefined ' + task.module + '.' + task.action);

  logger.debug('');
  logger.debug('task.js:executeTask: ' + task.module + '.' + task.action);

  var taskModule = findModule(task, context);

  if(!task.topTask) task.topTask = task;

  if(taskModule) {
    // condition false 면 bypass
    var fCondition = (typeof task.condition == 'string' && !eval(task.condition)) ||
        (task.condition instanceof Function && !task.condition(task, context));

    var _successCallback = function(task, context) {
      if(task.postCallback) {
        logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback start');

        task.postCallback(task, context, function(_task, _context) {
          logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' postCallback end');

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

        logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' end');

        if(successCallback) successCallback(task, context);
      }
    };

    // console.log('executeTask: ' + task.module + '.' + task.action);

    var _call = function() {
      if(task.preCallback) {
        logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback start');

        task.preCallback(task, context, function(_task, _context) {
          logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' preCallback end');

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
      logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs check start.');

      var type = utils.requireNoCache('./type');

      for(var i = 0; i < task.paramDefs.length; i++) {
        var paramDef = task.paramDefs[i];

        logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs check ' + JSON.stringify(paramDef));

        if(task[paramDef.name] == undefined) {
          logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs task.' + paramDef.name + '=' + task[paramDef.name]);

          // 디폴트 값 user context 에서 가져오기
          if(context.user[paramDef.name]) {
            paramDef.default = context.user[paramDef.name];
          }

          if(paramDef.default == undefined && paramDef.isDisplay != false) {
            logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs pending for user input ' + paramDef.name);

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
            logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs no pending, use default: ' + paramDef.default);

            var paramType = type[paramDef.type+'Type'];
            if(paramType && paramType.typeCheck) {

              var typeText = paramDef.default ? paramDef.default : task.in;
              paramType.name = paramDef.name;
              paramType.typeCheck(typeText, paramType, task, context, function (_text, _task, matched) {
                paramType.name = paramDef.type;

                if(matched) {
                  if(paramDef.customCheck) {
                    paramDef.customCheck(typeText, paramType, task, context, function (__text, __task, _matched) {
                      if(_matched) {
                        _call();
                        // return executeTask(__task, context, successCallback, errorCallback);
                      } else {
                        if(paramType.checkRequired) {
                          task.topTask.topSuccessCallback(paramType.checkRequired(__text) +
                            context.global.messages.typeExit);
                        } else {
                          task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) +
                            context.global.messages.typeExit, (paramDef.buttons ? {buttons: paramDef.buttons}: null));
                        }
                      }
                    });
                  } else {
                    _call();
                    // return executeTask(_task, context, successCallback, errorCallback);
                  }
                } else {
                  if(paramType.checkRequired) {
                    task.topTask.topSuccessCallback(paramType.checkRequired(_text) +
                      context.global.messages.typeExit);
                  } else {
                    task.topTask.topSuccessCallback((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) +
                      context.global.messages.typeExit, (paramDef.buttons ? {buttons: paramDef.buttons}: null));
                  }
                }

              });

              // return;
            } else {
              if(paramType) {
                errorCallback(new Error('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs type not found. type: ' +
                  paramDef.type + ' name: ' + paramDef.name), task, context);
              } else {
                errorCallback(new Error('task.js:executeTask: ' + task.module + '.' + task.action + ' paramDefs type typeCheck funtion not found. type: ' +
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
    errorCallback(new Error('task.js:executeTask: Module not exist. ' + task.module + '.' + task.action), task, context);
    return false;
  }
}


exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {
  logger.debug('');
  logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' start');

  if(task.action == 'sequence' || task.action == 'repeat' || task.action == 'iteration') {
    task.taskCounter = 0;
    var taskNum = 0;
    var curTask = task.actions[taskNum];
    var preTask;

    var _successCallback = function(_task, _context) {
      logger.debug('task.js:execute: successCallback ' + _task.module + '.' + _task.action);

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

        logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' sequence end');

        successCallback(task, context);
      } else if (task.action == 'repeat' &&
        ((typeof _task.condition == 'string' && !eval(_task.condition)) ||
        (_task.condition instanceof Function && !_task.condition(_task, _context)) ||
        task.taskCounter >= task.taskLimit || task.taskCounter >= MAX_ACTION)) {

        logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' repeat end');

        successCallback(task, context);
      } else if (task.action == 'iteration' &&
        ((typeof task.condition == 'string' && !eval(task.condition)) ||
        (task.condition instanceof Function && !task.condition(_task, _context)) ||
        task.taskCounter >= task.taskLimit || task.taskCounter >= MAX_ACTION)) {

        logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' iteration end');

        successCallback(task, context);
      } else {
        if(task.action == 'iteration') taskNum = task.taskCounter % task.actions.length;

        if(task.taskCounter != 0) preTask = curTask;
        curTask = utils.clone(task.actions[taskNum]);
        curTask.parent =  task;
        curTask.topTask = task.topTask;
        curTask.preTask = preTask;

        if (curTask.setData) curTask.doc = _task.doc;

        // if((typeof curTask.condition == 'string' && !eval(curTask.condition)) ||
        //   (curTask.condition instanceof Function && !curTask.condition(curTask, _context))) {
        //
        //   logger.debug('task.js:execute: ' + task.module + '.' + task.action + '[' + taskNum + ':' + task.taskCounter + '] ' + curTask.module + '.' + curTask.action + ' PASSED condition false');
        //
        //   _successCallback(curTask, _context, __successCallback, errorCallback);
        // } else {
          logger.debug('task.js:execute: ' + task.module + '.' + task.action + '[' + taskNum + ':' + task.taskCounter + '] ' + curTask.module + '.' + curTask.action);

          executeTask(curTask, _context, __successCallback, errorCallback);
        // }
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
