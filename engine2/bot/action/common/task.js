var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require('./utils');
var async = require('async');
var dialogModule = require(path.resolve('engine2/bot/action/common/dialog'));
const MAX_ACTION = 100;

function executeTask(task, context, callback, print, options) {
  if(task == undefined) throw new Error('task.js:executeTask: Wrong arguments. task undefined');
  if(context == undefined) throw new Error('task.js:executeTask: Wrong arguments. context undefined ' + task.module + '.' + task.action);
  if(callback == undefined) throw new Error('task.js:executeTask: Wrong arguments. callback undefined ' + task.module + '.' + task.action);

  if(task.template) {
    task = templateTask(task, context);
  }

  var logPrefix = 'task.js:executeTask: ' + (task.module == undefined ? '' : task.module) + '.' + (task.action instanceof Function ? task.action.name : task.action);
  logger.debug('');
  logger.debug(logPrefix);

  if(!task.topTask) {
    task.topTask = task;
  }

  if(task.action) {
    var fCondition = (typeof task.if == 'string' && !eval(task.if)) ||
      (task.if instanceof Function && !task.if(task, context));

    if(!fCondition) {

      logger.debug(logPrefix + '.paramDefs: CHECK START.');

      var type = utils.requireNoCache('./type');

      // paramDef 체크
      async.eachSeries(task.paramDefs, function(paramDef, callbackEach) {
        logger.debug(logPrefix + '.paramDefs.' + paramDef.name + ': ' + task[paramDef.name] + ' each start ');

        if(task[paramDef.name] == undefined) {
          if(paramDef.context && context.user[paramDef.name] != undefined) {
            task[paramDef.name] = context.user[paramDef.name];
            callbackEach();
          } else if(paramDef.type && context.botUser.entities[paramDef.type] != undefined) {
            task[paramDef.type] = context.botUser.entities[paramDef.type];
            callbackEach();
          } else {
            var paramType;
            if(typeof paramDef.type === 'string' || paramDef.type instanceof String) {
              if(type[paramDef.type+'Type'] != undefined) paramType = type[paramDef.type+'Type'];
              else paramType = {};
            } else paramType = paramDef.type;

            paramType.name = paramDef.name;

            var printRequired = function(text, inDoc, paramDef, paramType) {
              if(inDoc.requiredOut) {
                print(inDoc.requiredOut + context.global.messages.typeExit, inDoc);
              } else {
                print((paramDef.question instanceof Function ? paramDef.question(inDoc, context) : paramDef.question) +
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

            var typeInRaw, typeIn;
            var matchedCheck = function(callback) {

              if(task.in && (paramDef.match == undefined || paramDef.match)) {
                typeInRaw = task.inRaw;
                typeIn = task.in;
              } else {
                // 디폴트 값 user context 에서 가져오기
                if(context.user[paramDef.name] && typeof context.user[paramDef.name] == 'string') {
                  typeInRaw = context.user[paramDef.name + 'Raw'];
                  typeIn = context.user[paramDef.name];
                } else if(paramDef.default && typeof paramDef.default == 'string') {
                  typeInRaw = paramDef.default + 'Raw';
                  typeIn = paramDef.default;
                }
              }

              if(typeIn) {
                callback(null, typeInRaw, typeIn, task);
              // } else if(paramDef.dialog){
              //   callback(null, _inRaw, _inNLP, task)
              } else if(paramDef.required) {
                if(paramDef.question) {
                  context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                    // task.topTask.print = print;
                    context.user.pendingCallback = null;
                    callback(null, _inRaw, _inNLP, task)
                  };

                  printRequired(null, task, paramDef, paramType);
                } else if(paramDef.questionDialog) {
                  var _dialog = {
                    input: false,
                    output: {returnCall: paramDef.questionDialog, options: {returnDialog: options.currentDialog.name}}
                  };
                  dialogModule.executeDialog(_dialog, context, print, function(_matched, __dialog) {
                    // callback(true, null, null, task, false);
                  }, null);
                }
              }
            };

            var typeCheckCallback;
            var typeCheck = function(inRaw, inNLP, inDoc, callback) {
              if(!typeCheckCallback) typeCheckCallback = callback;

              /*if(paramDef.dialog) {
                dialog.executeDialog(paramDef.dialog, context, null, task.topTask.print, function(matched) {
                  if(matched) callback(null, inRaw, inNLP, inDoc, matched);
                });
              } else */if(paramType.typeCheck) {

                if(typeof paramType.typeCheck == 'string') {
                  var _typeCheck = context.bot.typeChecks[paramType.typeCheck];
                  if(_typeCheck) paramType.typeCheck = _typeCheck;
                  else {
                    _typeCheck = context.global.typeChecks[paramType.typeCheck];
                    if(_typeCheck) paramType.typeCheck = _typeCheck;
                  }
                }

                paramType.typeCheck((paramDef.raw ? inRaw : inNLP), paramType, inDoc, context, function (_text, _inDoc, matched) {
                  callback(null, inRaw, inNLP, _inDoc, matched);
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
                    context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                      task.topTask.print = print;
                      context.user.pendingCallback = null;
                      callback(null, _inRaw, _inNLP, task, false);
                    };

                    // task.print(type.processOutput(inDoc, context, '다음 중 원하시는 것을 선택해주세요.\n#'+paramDef.name+'#+index+. +name+\n#'));
                    task.topTask.print(type.processOutput(inDoc, context, paramType.out));
                  }

                } else
                  callback(null, inRaw, inNLP, inDoc, matched);
              } else if(paramDef.required) {
                context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                  // task.topTask.print = print;
                  context.user.pendingCallback = null;
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
                    task[paramDef.name] = context.user.doc[num-1];
                    context.user.doc = null;

                    if(task.in && task[paramDef.name]['matchOriginal']) {
                      task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
                      task[paramDef.name+'Original'] = task[paramDef.name]['matchOriginal'];
                    }

                    callback(null, inRaw, inNLP, inDoc, true);
                  } else {
                    context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                      task.topTask.print = print;
                      context.user.pendingCallback = null;
                      multiMatchedSelect(null, _inRaw, _inNLP, task, multiMatchedSelectCallback);
                    };

                    task.topTask.print('번호를 입력해 주세요.');
                  }
                } catch (e) {
                  context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                    task.topTask.print = print;
                    context.user.pendingCallback = null;
                    multiMatchedSelect(null, _inRaw, _inNLP, task, multiMatchedSelectCallback);
                  };

                  task.topTask.print('번호를 입력해 주세요.');
                }
              }
            };

            var customCheckCallback;
            var customCheck = function(inRaw, inNLP, inDoc, matched, callback) {
              if(!customCheckCallback) customCheckCallback = callback;

              if (matched) {
                if (paramDef.customCheck) {
                  paramDef.customCheck((paramType.raw ? inRaw : inNLP), paramType, inDoc, context, function (_text, _inDoc, _matched) {
                    callback(null, inRaw, inNLP, _inDoc, _matched)
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
                context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                  // task.topTask.print = print;
                  context.user.pendingCallback = null;
                  customCheck(_inRaw, _inNLP, task, true, customCheckCallback);
                };

                printRequired(inRaw, inDoc, paramDef, paramType);
              } else {

                if(paramDef.context && matched) {
                  context.user[paramDef.name] = task[paramDef.name];
                  // context.user.updates = [paramDef.name];
                  // botUser.updateUserContext(context.user, context, function(){
                  //   context.user.updates = null;
                    callback(null, inRaw, inNLP, inDoc, matched);
                  // });
                } else {
                  callback(null, inRaw, inNLP, inDoc, matched);
                }
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
                logger.debug(logPrefix + '.paramDefs.' + paramDef.name + ': ' + (_matched ? 'matched': 'not matched'));

                // logger.debug(logPrefix + '.paramDefs.' + paramDef.name + ': ' + 'each callback');
                callbackEach();
              }
            );

          }
        } else {
          callbackEach();
        }

      }, function(err) {

        if(err) {
          logger.debug(logPrefix + '.paramDefs end with pending');
        } else {
          logger.debug(logPrefix + '.paramDefs end');

          // task 비동기 실행
          async.waterfall([
              function(callback) {
                if(task.preCallback) {
                  logger.debug(logPrefix + ' preCallback start');
                  try {
                    task.preCallback(task, context, function (_task, _context) {
                      logger.debug(logPrefix + ' preCallback end');
                      callback(null, _task, _context);
                    });
                  } catch (e) {
                    console.log(e.stack, context);
                  }
                } else {
                  callback(null, task, context);
                }
              },

              function(_task, _context, callback) {
                if(!fCondition) {
                  if(task.module) {
                    var module;
                    if('string' == typeof task.module) {
                      module = findActionModule(task, context);
                    } else {
                      module = task.module;
                    }
                    if(module[task.action]) task.action = module[task.action];
                  } else if(typeof task.action == 'string') {
                    var _action = context.bot.actions[task.action];
                    if(_action) task.action = _action;
                    else {
                      _action = context.global.actions[task.action];
                      if(_action) task.action = _action;
                    }
                  }

                  if(task.action instanceof Function) {
                    try {
                      task.action(_task, _context, function (_task, _context) {
                        callback(null, _task, _context);
                      });
                    } catch(e) {
                      console.log(e.stack, context);
                    }
                  // } else if(taskModule && taskModule[task.action] instanceof Function) {
                  //   taskModule[task.action](_task, _context, function(_task, _context) {
                  //     callback(null, _task, _context);
                  //   });
                  } else if(module && module.execute instanceof Function) {
                    try {
                      module.execute(_task, _context, function (_task, _context) {
                        callback(null, _task, _context);
                      });
                    } catch (e) {
                      console.log(e.stack, context);
                    }
                  } else {
                    console.log(logPrefix + ' action not exist.', context);
                    task.err = new Error(logPrefix + ' action not exist.');
                    callback(task, context);

                    // errorCallback(new Error('task.js:executeTask: Function not exist ' + task.module + '.' + task.action), task, context);
                  }
                } else {
                  callback(null, _task, _context);
                }
              },

              function(_task, _context, callback) {
                if(task.postCallback) {
                  logger.debug(logPrefix + ' postCallback end');
                  try {
                    task.postCallback(_task, _context, function (_task, _context) {
                      logger.debug(logPrefix + ' postCallback end');
                      callback(null, _task, _context);
                    });
                  } catch (e) {
                    console.log(e.stack, context);
                  }
                } else {
                  callback(null, _task, _context);
                }
              }
            
            ],
            function(err, _task, _context) {
              logger.debug(logPrefix + ' end');

              if(!_task || !_context) {
                console.log(logPrefix + ' Wrong postCallback. Check callback(task, context)', context);
                task.err = new Error(logPrefix + ' Wrong postCallback. Check callback(task, context)');
                callback(task, context);
              }

              if(_task.taskOut) {
                var type = utils.requireNoCache('./type');
                _task.topTask.print(type.processOutput(_task, _context, _task.taskOut));
              }

              if(callback) callback(_task, _context);
            });

        }
      });

    } else {
      logger.debug(logPrefix + ' PASSED condition false');

      callback(task, context);
    }


  } else {
    console.log(logPrefix + ' Module not exist.', context);
    task.err = new Error(logPrefix + ' Module not exist.');
    callback(task, context);
    return false;
  }
}

exports.executeTask = executeTask;


function execute(task, context, successCallback, errorCallback) {
  logger.debug('');
  logger.debug('task.js:execute: ' + task.module + '.' + (task.action instanceof Function ? task.action.name : task.action) + ' start');

  if(task.action == 'sequence' || task.action == 'while' || task.action == 'for') {
    task.taskCounter = 0;
    var taskNum = 0;
    var curTask = task.actions[taskNum];
    var preTask;

    var _successCallback = function(_task, _context) {
      logger.debug('task.js:execute: successCallback ' + _task.module + '.' + (_task.action instanceof Function ? _task.action.name : _task.action));

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
      } else if (task.action == 'while' &&
        ((typeof task.whileIf == 'string' && !eval(task.whileIf)) ||
        (task.whileIf instanceof Function && !task.whileIf(task, _context)) ||
        task.taskCounter >= MAX_ACTION)) {

        logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' repeat end');

        successCallback(task, context);
      } else if (task.action == 'for' &&
        ((typeof task.forIf == 'string' && !eval(task.forIf)) ||
        (task.forIf instanceof Function && !task.forIf(task, _context)) ||
        task.taskCounter >= task.taskLimit || task.taskCounter >= MAX_ACTION)) {

        logger.debug('task.js:execute: ' + task.module + '.' + task.action + ' iteration end');

        successCallback(task, context);
      } else {
        if(task.action == 'for') taskNum = task.taskCounter % task.actions.length;

        if(task.taskCounter != 0) preTask = curTask;
        curTask = utils.clone(task.actions[taskNum]);
        curTask.parentTask =  task;
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

exports.execute = execute;

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

function findActionModule(task, context) {
  var module;
  var botName = context.bot.botName;

  //template action
  var modulePath;
  try {
    modulePath = './custom_modules/' + botName + '/' + (task.module ? task.module : botName);
    var path1 = path.resolve(modulePath);
    delete require.cache[require.resolve(path1)];
    module = require(path1);

  } catch(err) {
    // console.log("error loading custom module: " + botName + "/" + task.module + '/' + task.action);
    // console.log(err);
  }

  // common action
  if(!module) {
    try {
      modulePath = './modules/bot/action/common/' + task.module;
      var path1 = path.resolve(modulePath);
      // delete require.cache[require.resolve(modulePath)];
      delete require.cache[require.resolve(path1)];
      module = require(path1);
    } catch(err) {
      // console.log("error loading common module: " + task.module);
      // console.log(err);
    }
  }

  return module;
}

function templateTask(task, context) {
  var template;
  if(typeof task.template == 'string') {
    template = context.bot.tasks[task.template];
  } else {
    template = task.template;
  }

  task = mergeTemplate(template, task, context);

  return task;
}


function mergeTemplate(source1, source2, context){
  if(!source1 && !source2) return undefined;
  else if(!source1 && source2) return source2;
  else if(source1 && !source2) return source1;

  if(source1.template) {
    source1 = templateTask(source1, context);
  }

  var merged;
  if(source2.constructor==Object) {
    merged = Object.assign({}, source1);
    for (var attrname in source2) {
      if( attrname == 'template') {

      } else if( attrname == 'parent' || attrname == 'top') {
        merged[attrname] = source2[attrname];
      } else if ( source2[attrname]!=null && (source2[attrname].constructor==Object || source2[attrname].constructor==Array)) {
        merged[attrname] = mergeTemplate(source1[attrname], source2[attrname], context);
      } else {
        merged[attrname] = source2[attrname];
      }
    }
  } else if(source2.constructor==Array) {
    merged = Object.assign({}, source1);

    for (var i = 0, len = source2.length; i < len; i++) {
      if(source1[i] && source2[i]) {
        if ( (source2[i].constructor==Object || source2[i].constructor==Array)) {
          merged[i] = mergeTemplate(source1[i], source2[i], context);
        } else {
          merged[i] = source2[i];
        }
      }
    }
  } else {
    merged = source2;
  }

  return merged;
}


function execTask(task, context, callback) {
  var words = task.inRaw.split(' ');
  task.module = words[1];
  task.action = words[2];

  executeTask(task, context, function(task, context) {
    callback(task, context);
  });
};

exports.execTask = execTask;

function paramDefType(paramDef){
  if(paramDef.type == undefined || paramDef.typeCheck) return paramDef;

  var _type;
  if(paramDef.type.constructor == String) _type = type[paramDef.type + 'Type'];
  else _type = paramDef.type;

  var merged = Object.assign({}, _type);
  var source1 = _type;
  var source2 = paramDef;

  for (var attrname in source2) {
    if( attrname == 'type') continue;
    else if ( source2[attrname]!=null && source2[attrname].constructor==Object ) {
      merged[attrname] = utils.mergeWithClone(source1[attrname], source2[attrname]);
    } else {
      merged[attrname] = source2[attrname];
    }
  }

  return merged;
};

exports.paramDefType = paramDefType;
