var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require('./utils');
var async = require('async');
var taskModule = require(path.resolve('modules/bot/action/common/task'));
var type = require(path.resolve('modules/bot/action/common/type'));

const START_DIALOG_NAME = '시작';
exports.START_DIALOG_NAME = START_DIALOG_NAME;
const NO_DIALOG_NAME = '답변없음';
exports.NO_DIALOG_NAME = NO_DIALOG_NAME;

function findDialog(dialog, context, name) {
  if (dialog == null) {
    for (var i = 0; context.bot.dialogs && i < context.bot.dialogs.length; i++) {
      var dialog = context.bot.dialogs[i];
      var found = findDialog(dialog, context, name);
      if(found) return found;
    }
    for (var i = 0; context.bot.globalDialogs && i < context.bot.globalDialogs.length; i++) {
      var dialog = context.bot.globalDialogs[i];
      var found = findDialog(dialog, context, name);
      if(found) return found;
    }
    return null;
  } else if (dialog.name == name) {
    return dialog;
  } else if(Array.isArray(dialog.children)) {
    for (var i = 0; i < dialog.children.length; i++) {
      var rejoinder = dialog.children[i];
      var found = findDialog(rejoinder, context, name);
      if(found) return found;
    }
    return null;
  } else {
    return null;
  }
}
exports.findDialog = findDialog;

function findGlobalDialog(dialog, context, name) {
  if (dialog == null) {
    for (var i = 0; context.bot.globalDialogs && i < context.bot.globalDialogs.length; i++) {
      var dialog = context.bot.globalDialogs[i];
      var found = findDialog(dialog, context, name);
      if(found) return found;
    }
    return null;
  } else if (dialog.name == name) {
    return dialog;
  } else if(Array.isArray(dialog.children)) {
    for (var i = 0; i < dialog.children.length; i++) {
      var rejoinder = dialog.children[i];
      var found = findDialog(rejoinder, context, name);
      if(found) return found;
    }
    return null;
  } else {
    return null;
  }
}

exports.findGlobalDialog = findGlobalDialog;

function findUpDialog(dialog, context, print, callback) {
  if(context.botUser.pendingDialog.parent)
    return context.botUser.pendingDialog.parent;
    // executeDialog(context.botUser.pendingDialog.parent, context, print, callback);
  else
    return findGlobalDialog(null, context, '시작');
    // executeDialog(findGlobalDialog(null, context, '시작'), context, print, callback);

}

exports.findUpDialog = findUpDialog;

function matchGlobalDialogs(inRaw, inNLP, dialogs, context, print, callback) {
  context.botUser.dialog.typeMatches = {};

  matchDialogs(inRaw, inNLP, dialogs, context, print, function(matched) {
    if(matched) {
      callback(true);
    } else {
      matchDialogs(inRaw, inNLP, context.bot.globalDialogs, context, print, function(matched) {
        if(matched == true) {
          callback(matched);
        } else {
          for (var i = 0; i < dialogs.length; i++) {
            var dialog = dialogs[i];
            if(dialog.input == undefined || dialog.name == NO_DIALOG_NAME ) {
              executeDialog(dialog, context, print, callback);
              callback(true);
              return;
            }
          }

          executeDialog(context.bot.noDialog, context, print, callback);
          callback(true);
        }
      });
    }
  });
}

exports.matchGlobalDialogs = matchGlobalDialogs;

function matchDialogs(inRaw, inNLP, dialogs, context, print, callback) {
  if(Array.isArray(dialogs)) {
    var eachMatched = false;
    async.eachSeries(dialogs, function(dialog, cb) {

      var matchInput = function(input, _cb) {
        eachMatched = false;

        async.waterfall([
          function(cb2) {
            if(input == undefined || input == false || dialog.name == NO_DIALOG_NAME ) {
              cb2(true, false);
            } else if(input instanceof Function) {
              input(inRaw, inNLP, dialog, context, function(matched) {
                if(matched) cb2(true, true);
                else cb2(true, false);
              })
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && input.regexp) {
              if (inNLP.search(utils.concepRegExp(context, input.regexp)) != -1) {
                cb2(null, true);
              } else {
                cb2(true, false);
              }
            } else if(input && input instanceof RegExp) {
              if (inNLP.search(utils.concepRegExp(context, input)) != -1) {
                cb2(null, true);
              } else {
                cb2(true, false);
              }
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && input.condition) {
              if(input.condition.constructor == String) {
                if(eval(input.condition)) cb2(null, true);
                else cb2(true, false);
              } else if(input.condition instanceof Function) {
                input.condition(inRaw, inNLP, dialog, context, function(matched) {
                  if(matched) cb2(null, true);
                  else cb2(true, false);
                });
              } else {
                cb2(null, true);
              }
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && Array.isArray(input.types)) {
              var eachMatched2 = true;
              async.eachSeries(input.types, function (type1, cb3) {
                var type2 = taskModule.paramDefType(type1);
                if (dialog.task == undefined) dialog.task = {};
                if(context.botUser.dialog.typeMatches[type2.name] == undefined) {
                  type2.typeCheck(type2.raw ? inRaw : inNLP, type2, dialog.task, context, function (inNLP, task, _matched) {
                    if (_matched) {
                      if(type2.context)
                        context.user[type2.name] = task[type2.name];

                      context.botUser.dialog[type2.name] = task[type2.name];
                      context.botUser.dialog.typeMatches[type2.name] = task[type2.name];
                      cb3(null);
                    } else {
                      eachMatched2 = false;
                      cb3(true);
                    }
                  });
                } else {
                  cb3(null);
                }
              }, function (err) {
                if (eachMatched2) cb2(null, true);
                else cb2(true, false);
              });
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(typeof input == 'string') {
              var _matched = true;
              var words = input.split(/\s/);
              for (var i = 0; i < words.length; i++) {
                var word = words[i];

                if(word.startsWith('~')) {
                  _matched = false;
                  var concepts = utils.findConcepts(context, word.substring(1));
                  for (var j = 0; j < concepts.length; j++) {
                    var concept = concepts[j];
                    if(inNLP.search(new RegExp(concept, 'i')) != -1) {
                      _matched = true;
                      break;
                    }
                  }

                  if(!_matched) break;
                } else if(inNLP.search(new RegExp(word, 'i')) == -1) {
                  _matched = false;
                  break;
                }
              }

              // if(input == inRaw) cb2(null, true);
              if(_matched) cb2(null, true);
              else cb2(null, false);
            } else {
              cb2(null, true);
            }
          }

        ], function(err, matched) {
          if(matched) {
            if(process.env.NODE_ENV == 'development' && dialog.name == '시작') {
              var module = taskModule.findModule({module: context.bot.module}, context);
              if(module) {
                context.bot.globalDialogs= module.globalDialogs;
                context.bot.dialogs = module.dialogs;
              }
            }

            executeDialog(dialog, context, print, callback);
            eachMatched = true; _cb(true);
          } else {
            eachMatched = false; _cb(null);
          }
        });
      };


      if(Array.isArray(dialog.input)) {
        async.eachSeries(dialog.input, function(input, cb3) {
          matchInput(input, function() {
            if(eachMatched) cb(true);
            else cb3(null);
          });
        }, function(err) {
          cb(null);
        })
      } else {
        matchInput(dialog.input, cb);
      }

    }, function(err){
      if(eachMatched) callback(true);
      else callback(false)
    });
  } else {
    callback(false);
  }
}

exports.matchDialogs = matchDialogs;



function executeDialog(dialog, context, print, callback, options) {
  logger.debug('executeDialog:' + (dialog.name ? ' name=' + dialog.name: '') +
    (dialog.input ? ' input=' + utils.toString(dialog.input): '') +
    (dialog.output ? ' output=' + utils.toString(dialog.output): ''));

  context.botUser.pendeingDialog = null;
  context.user.pendingCallback = null;

  async.waterfall([
    function(cb) {
      if (dialog.task && dialog.task.action) {
        taskModule.executeTask(dialog.task, context, function (_task, context) {
          cb(null);
        });
      } else {
        cb(null);
      }
    },

    function(cb) {
      if(dialog.output instanceof Function) {
        dialog.output(dialog, context, print, callback);
        cb(true);
      } else if(dialog.output.constructor == Object && dialog.output.text == undefined) {
        var _dialog;

        if (dialog.output.call) {
          _dialog = findDialog(null, context, dialog.output.call);          // TODO 호출할 함수 없을 때 처리

        } else if (dialog.output.callGlobal) {
          _dialog = findGlobalDialog(null, context, dialog.output.callGlobal);

        } else if (dialog.output.up) {
          _dialog = findUpDialog(dialog, context, print, callback);

        } else if (dialog.output.back) {

        } else if (dialog.output.repeat) {
          _dialog = context.botUser.pendingDialog;

        } else {
          _dialog = dialog.output;
        }

        if (dialog.output.options && dialog.output.options.output) {
          print(dialog.output.options.output);
          if (_dialog) executeDialog(_dialog, context, print, callback, {output: false});

          cb(true);
        } else {
          if (_dialog) executeDialog(_dialog, context, print, callback, dialog.output.options);

          cb(true);
        }

      } else if (Array.isArray(dialog.output)) {
        var conditionMatch = undefined, outputs = [];
        async.eachSeries(dialog.output, function(output, cb2) {
          if(output.condition) {
            if(output.condition.constructor == String) {
              if (eval(output.condition)) {
                executeDialog(output, context, print, callback);
                cb(true);
                // conditionMatch = output;
                // cb2(true);
              } else cb2(null);
            } else if(output.condition instanceof Function) {
              output.condition(dialog, context, function(matched) {
                if(matched) {
                  executeDialog(output, context, print, callback);
                  cb(true);
                  // conditionMatch = output;
                  // cb2(true);
                } else cb2(null);
              })
            } else {
              cb2(null);
            }
          } else {
            outputs.push(output);
            cb2(null);
          }
        }, function(err) {
          if(conditionMatch) {
            cb(null, conditionMatch);
          } else {
            if(outputs.length > 0) {
              // executeDialog(outputs[Math.floor(Math.random() * outputs.length)], context, print, callback);
              cb(null, outputs[Math.floor(Math.random() * outputs.length)]);
            } else {
              cb(null, dialog.output);                                          // 매칭된 condition이 없거나 outputs len이 0인 경우
            }
          }
        });

      } else {
        cb(null, dialog.output);
      }
    },

    function(output, cb) {
      if(output) {
        if(options == undefined || options.output != false) {
          var _output;
          if(typeof output == 'string') _output = output;
          else if(typeof output.text == 'string') {
            _output = output.text;
            if(dialog.task) dialog.task = utils.merge(dialog.task, output);
            else dialog.task = utils.clone(output);
          } else if(typeof output.output == 'string') {
            _output = output.output;
          }

          if(options) {
            _output = (options.prefix ? options.prefix : '') + _output +
              (options.postfix ? options.postfix : '');
          }

          if(dialog.task) {
            print(type.processOutput(dialog.task, context, _output), dialog.task);
          } else {
            print(_output);
          }
        }
      }

      if(output.condition)
        cb(null, output);
      else 
        cb(null);
    },

    function(output, cb) {
      if(dialog.task && dialog.task.err) {
        if(process.env.NODE_ENV == 'development')
          print(dialog.task.err);
        else
          print('일시적 오류가 발생하였습니다.\n\n불편을 드려 죄송합니다.\n\n"시작"을 입력하여 처음부터 다시 시작해 주세요');
      } else {
        context.botUser.pendingDialog = dialog;

        // var _dialog = output || dialog;
        var _dialog = dialog;

        logger.debug('PendingDialog:' + (_dialog.name ? ' name=' + _dialog.name: '') +
          (_dialog.input ? ' input=' + utils.toString(_dialog.input): '') +
          (_dialog.output ? ' output=' + utils.toString(_dialog.output): ''));

        if(Array.isArray(_dialog.children)) {
          for (var i = 0; i < _dialog.children.length; i++) {
            _dialog.children[i].parent = _dialog;
          }
          context.user.pendingCallback = function(inRaw, inNLP, inDoc, context, print) {
            matchGlobalDialogs(inRaw, inNLP, _dialog.children, context, print, callback);
          }
        }
      }
      callback(true);
    }
  ]);
}

exports.executeDialog = executeDialog;
