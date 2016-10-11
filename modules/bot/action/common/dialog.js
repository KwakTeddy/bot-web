var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require('./utils');
var async = require('async');
var taskModule = require(path.resolve('modules/bot/action/common/task'));
var type = require(path.resolve('modules/bot/action/common/type'));
var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'))

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
      if (found) return found;
    }
    return null;
  } else if(Array.isArray(dialog.output)) {
    for (var i = 0; i < dialog.output.length; i++) {
      var output = dialog.output[i];
      var found = findDialog(output, context, name);
      if (found) return found;
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
  if(context.botUser.currentDialog && context.botUser.currentDialog.parent)
    return context.botUser.currentDialog.parent;
    // executeDialog(context.botUser.currentDialog.parent, context, print, callback);
  else
    return findGlobalDialog(null, context, '시작');
    // executeDialog(findGlobalDialog(null, context, '시작'), context, print, callback);

}

exports.findUpDialog = findUpDialog;

function matchGlobalDialogs(inRaw, inNLP, dialogs, context, print, callback) {
  context.dialog.typeMatches = {};

  matchDialogs(inRaw, inNLP, context.bot.globalDialogs, context, print, function(matched) {
    if(matched) {
      callback(true);
    } else {
      matchDialogs(inRaw, inNLP, dialogs, context, print, function(matched) {
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

          if(context.bot.noDialog) executeDialog(context.bot.noDialog, context, print, callback);
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
            if(input === undefined || input === false || dialog.name == NO_DIALOG_NAME ) {
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
            if(input && Array.isArray(input.types)) {
              var eachMatched2 = true;
              async.eachSeries(input.types, function (type1, cb3) {
                var type2 = taskModule.paramDefType(type1);           // TODO type1 없는 경우 디버겅 처리
                if (dialog.task == undefined) dialog.task = {};

                executeType(inRaw, inNLP, type2, dialog.task, context, function(inNLP, task, _match) {
                  if(_match) cb3(null);
                  else {eachMatched2 = false, cb3(true);}
                });

              }, function (err) {
                if (eachMatched2) cb2(null, true);
                else cb2(true, false);
              });
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && input.if) {
              if(input.if.constructor == String) {
                if(eval(input.if)) cb2(null, true);
                else cb2(true, false);
              } else if(input.if instanceof Function) {
                input.if(inRaw, inNLP, dialog, context, function(matched) {
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
            // if(process.env.NODE_ENV == 'development' && dialog.name == '시작') {
            //   var module = taskModule.findModule({module: context.bot.module}, context);
            //   if(module) {
            //     context.bot.globalDialogs= module.globalDialogs;
            //     context.bot.dialogs = module.dialogs;
            //   }
            // }

            if(dialog.output.up) {
              if(context.botUser.currentDialog.parent)
                dialog.parent = context.botUser.currentDialog.parent.parent;
            } else {
              dialog.parent = context.botUser.currentDialog;
            }

            if(context.botUser.currentDialog) {
              dialog.top = context.botUser.currentDialog.top;
              if(context.botUser.currentDialog.upCallback) dialog.upCallback = context.botUser.currentDialog.upCallback;
              if(context.botUser.currentDialog.returnDialog) dialog.returnDialog = context.botUser.currentDialog.returnDialog;
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
  if(dialog.name || dialog.input) logger.debug('executeDialog: ' + toDialogString(dialog));

  // context.botUser.currentDialog = null;
  context.user.pendingCallback = null;

  if(options && options.current) {
    dialog.parent = options.current.parent;

    if(options.current.top) dialog.top = options.current.top;
    else dialog.top = options.current;

    if(options.current.output.upCallback) dialog.upCallback = options.current.output.upCallback;
    else if(options.current.upCallback) dialog.upCallback = options.current.upCallback;

    if(options.current.returnDialog) dialog.returnDialog = options.current.returnDialog;
    else if(options.current.output.returnCall) dialog.returnDialog = options.current.parent;
  }

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
        var _dialog, _output;

        var _execDialog = function(_dialog, outputName) {
          if(_dialog) {
            executeDialog(_dialog, context, print, callback, utils.merge(dialog.output.options, {current: dialog}));

            cb(true);
          } else {
            logger.debug(outputName + ': ' + dialog.output.call + ' Dialog를 찾을 수 없습니다.');
            if (process.env.NODE_ENV == 'development')
              _output = outputName + ': ' + dialog.output.call + ' Dialog를 찾을 수 없습니다.';
            else
              _output = context.messages.userError;
            cb(null, _output);
          }
        }

        if(dialog.output.return === 1 && dialog.returnDialog) {
          _dialog = dialog.returnDialog;
          dialog.returnDialog = null;
          _execDialog(_dialog, 'return');
        } else if (dialog.output.call) {
          _dialog = findDialog(null, context, dialog.output.call);

          _execDialog(_dialog, 'call');
        } else if (dialog.output.callGlobal) {
          _dialog = findGlobalDialog(null, context, dialog.output.callGlobal);

          _execDialog(_dialog, 'callGlobal');
        } else if (dialog.output.returnCall) {
          _dialog = findDialog(null, context, dialog.output.returnCall);

          _execDialog(_dialog, 'returnCall');
        } else if (dialog.output.up) {
          if(context.botUser.currentDialog && context.botUser.currentDialog.upCallback) {
            context.botUser.currentDialog.upCallback(dialog, context, function(__dialog) {
              if(__dialog) {
                executeDialog(__dialog, context, print, callback, utils.merge(dialog.output.options, {current: dialog}));
                cb(true);
              } else {
                _execDialog(_dialog, 'up');
              }
            });

          } else {
            _dialog = findUpDialog(dialog, context, print, callback);

            _execDialog(_dialog, 'up');
          }
        } else if (dialog.output.back) {

          _execDialog(_dialog, 'back');
        } else if (dialog.output.repeat) {
          _dialog = context.botUser.currentDialog;

          _execDialog(_dialog, 'repeat');
        } else {
          _dialog = dialog.output;
        }

      } else if (Array.isArray(dialog.output)) {
        var ifMatch = undefined, outputs = [];
        async.eachSeries(dialog.output, function(output, cb2) {
          if(output.if) {
            if(output.if.constructor == String) {
              if (eval(output.if)) {

                executeDialog(output, context, print, callback, {current: dialog});
                cb(true);

              } else cb2(null);
            } else if(output.if instanceof Function) {
              output.if(dialog, context, function(matched) {
                if(matched) {

                  executeDialog(output, context, print, callback, {current: dialog});
                  cb(true);
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
          if(ifMatch) {
            cb(null, ifMatch);
          } else {
            if(outputs.length > 0) {
              // executeDialog(outputs[Math.floor(Math.random() * outputs.length)], context, print, callback);
              cb(null, outputs[Math.floor(Math.random() * outputs.length)]);
            } else {
              cb(null, dialog.output);                                          // 매칭된 if이 없거나 outputs len이 0인 경우
            }
          }
        });

      } else {
        cb(null, dialog.output);
      }
    },

    function (output, cb) {
      var _output;
      if (options != undefined && typeof options.output == 'string') {
        _output = options.output;

      } else if (options == undefined || options.output != false) {
        if (typeof output == 'string') {
          _output = output;

        } else if (typeof output.text == 'string') {
          _output = output.text;
          if (dialog.task) dialog.task = utils.merge(dialog.task, output);
          else dialog.task = utils.clone(output);

        } else if (typeof output.output == 'string') {
          _output = output.output;
        }
      }

      if (options) {
        _output = (options.prefix ? options.prefix : '') + _output +
          (options.postfix ? options.postfix : '');
      }

      if (_output) {
        if(dialog.task && dialog.task.url) dialog.task.url = type.processOutput(dialog.task, context, dialog.task.url);
        if(dialog.task && dialog.task.urlMessage) dialog.task.urlMessage = type.processOutput(dialog.task, context, dialog.task.urlMessage);
        if(dialog.task && dialog.task.photo) dialog.task.photo = type.processOutput(dialog.task, context, dialog.task.photo);

        print(type.processOutput(dialog.task, context, _output), dialog.task);
        cb(null, _output);
      } else if (output.if) {
        cb(null, output);
      } else {
        cb(null);
      }
    },

    function(output, cb) {
      if(dialog.task && dialog.task.err) {
        if(process.env.NODE_ENV == 'development')
          print(dialog.task.err);
        else
          print(context.messages.userError);
      } else {
        context.botUser.currentDialog = dialog;

        var _dialog = dialog;

        // logger.debug('PendingDialog: ' + toDialogString(_dialog));

        if(Array.isArray(_dialog.children)) {
          // for (var i = 0; i < _dialog.children.length; i++) {
          //   _dialog.children[i].parent = _dialog;
          //
          //   if(_dialog.top) _dialog.children[i].top = _dialog.top;
          //   else _dialog.children[i].top = _dialog;
          // }

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

function toDialogString(dialog) {
  var str = '';

  if(dialog == undefined) return dialog;

  if(dialog.name) str += 'name=' + dialog.name + ' ';

  if(dialog.input) {
    if(typeof dialog.input == 'string') str += 'input=' + dialog.input;
    else if(dialog.input instanceof RegExp) str += 'input=' + dialog.input.toString();
    else {
      str += 'input={';
      if(dialog.input.regexp) str += 'regexp=' + dialog.input.regexp.toString() + ' ';

      if(dialog.input.types) {
        var strs = [];
        for (var i = 0; i < dialog.input.types.length; i++) {
          var input = dialog.input.types[i];
          if(input.name) strs.push('type=' + input.name);
          else if(input.typeCheck instanceof Function) {
            strs.push('typeCheck=' + input.typeCheck.name);
          }

          str += 'types=[' + strs.join(', ') + ']';
        }
      }

      if(dialog.input.if) {
        if(typeof dialog.input.if == 'string') str += 'if=' + dialog.input.if + ' ';
        else if(dialog.input.if instanceof Function) {
          if(dialog.input.if.name) str += 'if=' + dialog.input.if.name + ' ';
          else str += 'if=function ';
        }
      }
      str += '} ';
    }
  }

  if(dialog.output) {
    if (typeof dialog.output == 'string') str += 'output=' + dialog.output + ' ';
    else if (Array.isArray(dialog.output)) str += 'output=[outputs] ';
    else if(dialog.output instanceof Function) {
      if(dialog.output.name) str += 'output=' + dialog.output.name + ' ';
      else str += 'output=function ';
    }
    else if(dialog.output instanceof Object) str += 'output=' + JSON.stringify(dialog.output) + ' ';
  }
  
  if(dialog.children) {
    str += 'children=[child] ';
  }

  return str;

}


function executeType(inRaw, inNLP, type, task, context, callback) {
  async.waterfall([
    function(cb4) {
      if(type.preType) {
        type.preType(task, context, type, function (_task, _context, _type) {
          cb4(null);
        });
      } else {
        cb4(null);
      }
    },

    function(cb4) {
      if (context.dialog.typeMatches[type.name] == undefined) {
        type.typeCheck(type.raw ? inRaw : inNLP, type, task, context, function (inNLP, task, _matched) {

          // logger.debug('matchDialogs: [TYPE] ' + toDialogString(dialog) +
          //   ' CHECK TYPE=' + type.name + ' ' + (_matched ? 'matched' : 'not matched'));

          if (_matched) {
            context.dialog[type.name] = task[type.name];
            context.dialog.typeMatches[type.name] = task[type.name];

            if (type.context) {
              context.user[type.name] = task[type.name];
              context.user.updates = [type.name];
              botUser.updateUserContext(context.user, context, function () {
                context.user.updates = null;
                cb4(null, true);
              });
            } else {
              cb4(null, true);

            }

          } else {
            eachMatched2 = false;
            cb4(true, false);
          }
        });
      } else if (context.dialog.typeMatches[type.name] != undefined) {
        task[type.name] = context.dialog.typeMatches[type.name];
        cb4(null, true);
      } else {
        cb4(null);
      }
    }
  ], function(err, matched) {
    if(matched) callback(inNLP, task, true);
    else callback(inNLP, task, false);
  })

}

exports.executeType = executeType;