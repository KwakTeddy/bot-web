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

  if(!task.topTask) {
    task.topTask = task;
  }

  if(taskModule) {
    var fCondition = (typeof task.condition == 'string' && !eval(task.condition)) ||
      (task.condition instanceof Function && !task.condition(task, context));

    if(!fCondition) {

      logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs: CHECK START.');

      var type = utils.requireNoCache('./type');

      // paramDef 체크
      async.eachSeries(task.paramDefs, function(paramDef, callbackEach) {
        logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': ' + task[paramDef.name] + ' each start ');

        if(task[paramDef.name] == undefined) {
          var paramType;
          if(typeof paramDef.type === 'string' || paramDef.type instanceof String) paramType = type[paramDef.type+'Type'];
          else paramType = paramDef.type;

          paramType.name = paramDef.name;

          var printRequired = function(text, inDoc, paramDef, paramType) {
            if(inDoc.requiredOut) {
              task.print(inDoc.requiredOut + context.global.messages.typeExit, inDoc);
            } else {
              task.print((paramDef.question instanceof Function ? paramDef.question(inDoc, context) : paramDef.question) +
                context.global.messages.typeExit, inDoc);
            }
          };

          var preType = function(callback) {
            if(paramDef.preType) {
              paramDef.preType(task, context, paramType, paramDef, function (_task, _context) {
                callback(null);
              });
            } else {
              callback(null);
            }
          };

          var typeText;
          var matchedCheck = function(callback) {

            if(task.in && (paramDef.match == undefined || paramDef.match)) {
              typeText = task.in;
            } else {
              // 디폴트 값 user context 에서 가져오기
              if(context.user[paramDef.name] && typeof context.user[paramDef.name] == 'string') typeText = context.user[paramDef.name];
              else if(paramDef.default && typeof paramDef.default == 'string') typeText = paramDef.default;
            }

            if(typeText) {
              callback(null, typeText, typeText, task);
            } else if(paramDef.required) {
              context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                task.topTask.print = print;
                callback(null, _inRaw, _inNLP, task)
              };

              printRequired(null, task, paramDef, paramType);
            } else {
              callback(true, null, null, task, false);
            }
          };

          var typeCheckCallback;
          var typeCheck = function(inRaw, inNLP, inDoc, callback) {
            if(!typeCheckCallback) typeCheckCallback = callback;

            if(paramType.typeCheck) {
              paramType.typeCheck(inNLP, paramType, inDoc, context, function (_text, _inDoc, matched) {
                callback(null, _text, _text, _inDoc, matched);
              });
            } else {
              callback(true, inRaw, inNLP, inDoc, false);
            }
          };

          var multiMatched = function(inRaw, inNLP, inDoc, matched, callback) {
            if (matched) {
              if(inDoc[paramDef.name] instanceof Array) {

                if(inDoc[paramDef.name].length == 1) {
                  inDoc[paramDef.name] = inDoc[paramDef.name][0];
                  callback(null, inRaw, inNLP, inDoc, matched);
                } else {
                  context.user.doc = inDoc[paramDef.name];
                  context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                    task.topTask.print = print;
                    callback(null, _inRaw, inNLP, task, false);
                  };

                  // task.print(type.processOutput(inDoc, context, '다음 중 원하시는 것을 선택해주세요.\n#'+paramDef.name+'#+index+. +name+\n#'));
                  task.print(type.processOutput(inDoc, context, paramType.out));
                }

              } else
                callback(null, inRaw, inNLP, inDoc, matched);
            } else if(paramDef.required) {
              context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                task.topTask.print = print;
                typeCheck(_inRaw, _inNLP, task, typeCheckCallback);
              };

              printRequired(inRaw, inDoc, paramDef, paramType);
            } else {
              callback(true, inRaw, inNLP, inDoc, false);
            }
          };

          var multiMatchedSelectCallback;
          var multiMatchedSelect = function(inRaw, inNLP, inDoc, matched, callback) {
            if(!multiMatchedSelectCallback) multiMatchedSelectCallback = callback;

            if(matched) {
              callback(null, inRaw, inNLP, inDoc, matched);
            } else {
              try {
                var num = Number(inRaw);
                if (num >= 1 && num <= context.user.doc.length) {
                  task[paramDef.name] = context.user.doc[num-1];k
                  context.user.doc = null;

                  if(task.in && task[paramDef.name]['matchOriginal']) {
                    task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
                    task[paramDef.name+'Original'] = task[paramDef.name]['matchOriginal'];
                  }

                  callback(null, inRaw, inNLP, inDoc, true);
                } else {
                  context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                    task.topTask.print = print;
                    multiMatchedSelect(null, _inRaw, inNLP, task, multiMatchedSelectCallback);
                  };

                  task.print('번호를 입력해 주세요.');
                }
              } catch (e) {
                context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                  task.topTask.print = print;
                  multiMatchedSelect(null, _inRaw, inNLP, task, multiMatchedSelectCallback);
                };

                task.print('번호를 입력해 주세요.');
              }
            }
          };

          var customCheckCallback;
          var customCheck = function(inRaw, inNLP, inDoc, matched, callback) {
            if(!customCheckCallback) customCheckCallback = callback;

            if (matched) {
              if (paramDef.customCheck) {
                paramDef.customCheck(inNLP, paramType, inDoc, context, function (_text, _inDoc, _matched) {
                  callback(null, _text, inNLP, _inDoc, _matched)
                });
              } else {
                callback(null, inRaw, inNLP, inDoc, matched);
              }

            } else {
              callback(true, inRaw, inNLP, inDoc, false);
            }
          };

          var additionalCheck =  function(inRaw, inNLP, inDoc, matched, callback) {
            if(inDoc.requiredOut) {
              context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, print) {
                task.topTask.print = print;
                customCheck(_inRaw, _inNLP, task, true, customCheckCallback);
              };

              printRequired(inRaw, inDoc, paramDef, paramType);
            } else {
              callback(null, inRaw, inNLP, inDoc, matched);
            }
          };


          async.waterfall([
            preType,
            matchedCheck,
            typeCheck,
            multiMatched,
            multiMatchedSelect,
            customCheck,
            additionalCheck
            ],

            function(err, _inRaw, _inNLP, _task, _matched) {
              logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': ' + (_matched ? 'matched': 'not matched'));

              // logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + '.paramDefs.' + paramDef.name + ': ' + 'each callback');
              callbackEach();
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
            
            ],
            function(err, _task, _context) {
              logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' end');

              if(!_task || !_context) throw new Error('task.js:executeTask: wrong postCallback. In ' + task.module + '.' + task.action + ', Check callback(task, context)');

              if(_task.taskOut) {
                var type = utils.requireNoCache('./type');
                _task.topTask.print(type.processOutput(_task, _context, _task.taskOut));
              }

              if(successCallback) successCallback(_task, _context);
            });

        }
      });

    } else {
      logger.debug('task.js:executeTask: ' + task.module + '.' + task.action + ' PASSED condition false');

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
            _task.topTask.print(type.processOutput(_task, _context, _task.taskOut));
          }

          if(successCallback) successCallback(_task, _context);
        });
      } else {
        if(task.taskOut) {
          var type = utils.requireNoCache('./type');
          task.topTask.print(type.processOutput(task, _context, task.taskOut));
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
              task.inRaw = _inText;

              if(task[paramDef.name] == undefined) task[paramDef.name] = _inText;

              context.user.pendingCallback = null;
              context.user.pendingType = null;
              context.user.pendingParamDef = null;

              executeTask(task, context, successCallback, errorCallback);
            };

            context.user.pendingType = paramDef.type;
            context.user.pendingParamDef = paramDef;

            if(paramDef.isDisplay == undefined || paramDef.isDisplay == true) {
              if(task.print) task.print((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
              else if(task.topTask.print) task.topTask.print((paramDef.question instanceof Function ? paramDef.question(task, context) : paramDef.question));
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
                          task.topTask.print(paramType.checkRequired(__text) +
                            context.global.messages.typeExit);
                        } else {
                          task.topTask.print((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) +
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
                    task.topTask.print(paramType.checkRequired(_text) +
                      context.global.messages.typeExit);
                  } else {
                    task.topTask.print((paramDef.question instanceof Function ? paramDef.question(_task, context) : paramDef.question) +
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
          if (docMerge != 'none' && Array.isArray(task.doc)) task.doc = task.doc.concat(_task.doc);
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
        curTask.print = task.topTask.print;
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
  var modulePath;
  var templateModule;

  try {
    modulePath = '../../../../custom_modules/' + botName + '/' + (task.module ? task.module : botName);
    delete require.cache[require.resolve(modulePath)];
    templateModule = require(modulePath);

    if(templateModule) {
      if(templateModule[task.action] && !(templateModule[task.action] instanceof Function)) {
        //var template = utils.clone(templateModule[task.action]);
        var template = templateModule[task.action];
        task.templateAction = task.action;
        task.module = template.module;
        task.action = template.action;
        task = utils.merge(task, template);
        task.template = template;

        modulePath = '../../action/common/' + task.module;
        delete require.cache[require.resolve(modulePath)];
        taskModule = require(modulePath);

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
      modulePath = '../../action/common/' + task.module;
      delete require.cache[require.resolve(modulePath)];
      taskModule = require(modulePath);
    } catch(err) {
      // console.log("error loading common module: " + task.module);
      // console.log(err);
    }
  }

  return taskModule;
}
