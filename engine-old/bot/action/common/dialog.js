var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require('./utils');
var async = require('async');
var taskModule = require(path.resolve('engine2/bot/action/common/task'));
var type = require(path.resolve('engine2/bot/action/common/type'));
// var botUser= require(path.resolve('engine2/bot-users/server/controllers/bot-users.server.controller'))
var userDilaog = require(path.resolve('engine2/user-dialogs/server/controllers/user-dialogs.server.controller'));
var autoCorrection = require(path.resolve('engine2/bot/engine/nlp/autoCorrection'));
var quibble = require(path.resolve('engine2/bot/engine/dialog/quibbleModule'));
var intent = require(path.resolve('engine2/bot/engine/nlu/intent'));

const START_DIALOG_NAME = '시작';
exports.START_DIALOG_NAME = START_DIALOG_NAME;
const NO_DIALOG_NAME = '답변없음';
exports.NO_DIALOG_NAME = NO_DIALOG_NAME;

function findDialog(dialog, context, name) {
  // if(findGlobalDepth > 100) return null;

  if (dialog == null) {
    for (var i = 0; context.bot.dialogs && i < context.bot.dialogs.length; i++) {
      var dialog = context.bot.dialogs[i];
      if(dialog == null) continue;
      var found = findDialog(dialog, context, name);
      if(found) return found;
    }
    for (var i = 0; context.bot.commonDialogs && i < context.bot.commonDialogs.length; i++) {
      var dialog = context.bot.commonDialogs[i];
      if(dialog == null) continue;
      var found = findDialog(dialog, context, name);
      if(found) return found;
    }
    return null;
  } else if (dialog.name == name) {
    return dialog;
  } else if(Array.isArray(dialog.children)) {
    for (var i = 0; i < dialog.children.length; i++) {
      var rejoinder = dialog.children[i];
      if(rejoinder == null) continue;
      var found = findDialog(rejoinder, context, name);
      if (found) return found;
    }
    return null;
  } else if(Array.isArray(dialog.output)) {
    for (var i = 0; i < dialog.output.length; i++) {
      var output = dialog.output[i];
      if(output == null) continue;
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
    for (var i = 0; context.bot.commonDialogs && i < context.bot.commonDialogs.length; i++) {
      var dialog = context.bot.commonDialogs[i];
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

function matchGlobalDialogs(inRaw, inNLP, dialogs, context, print, callback, wordCorrection) {
  context.dialog.typeMatches = {};
  context.dialog.typeInits = {};
  context.dialog.isFail = false;
  context.botUser.wordCorrection = wordCorrection;

  matchDialogs(inRaw, inNLP, context.bot.commonDialogs, context, print, function(matched, _dialog) {
    if(matched) {
      callback(true, _dialog);
    } else {
      matchDialogs(inRaw, inNLP, dialogs, context, print, function(matched, _dialog) {
        if (matched == true) {
          callback(matched, _dialog);
        // } else if (context.botUser.intentDialog) {
        //   executeDialog(context.botUser.intentDialog, context, print, callback);
        } else if (context.bot.useAutoCorrection == true && !wordCorrection) {
          var _inRaw = autoCorrection.correction(inRaw);
          context.botUser.orgNlp = context.botUser.nlp;
          type.processInput(context, _inRaw, function (_inNLP, _inDoc) {
            context.botUser.nlpCorrection = _inNLP;
            context.botUser.inRawCorrection = _inRaw;
            matchGlobalDialogs(_inRaw, _inNLP, dialogs, context, print, callback, true);
          });
        } else {
          for (var i = 0; i < dialogs.length; i++) {
            var dialog = dialogs[i];
            if (dialog.input == undefined || dialog.input === '' || dialog.name == NO_DIALOG_NAME) {
              executeDialog(dialog, context, print, callback);
              context.dialog.isFail = true;
              callback(true, dialog);
              return;
            }
          }

          if (context.botUser.orgNlp) context.botUser.nlp = context.botUser.orgNlp;
          context.botUser.orgNlp = null;

          if (context.bot.useQuibble == true) {
            context.dialog.isFail = true;
            // print(quibble.quibble(context));
            var dialog = {id: -1, name: 'quibble', input: 'false', output: quibble.quibble(context)};
            executeDialog(dialog, context, print, callback);
          } else if (context.bot.noDialog) {
            context.dialog.isFail = true;
            executeDialog(context.bot.noDialog, context, print, callback);
          } else {
            context.dialog.isFail = true;
            console.error('NO_DIALOG(답변없음)가 없습니다. 아래와 같이 설정바랍니다.\n답변없음:c<> 알아듣지 못하는 말입니다.');
            // print('학습되어 있지 않은 대화 입니다.');
            // callback(true, context.bot.noDialog);
            var dialog = {id: -1, name: 'no_dialog', input: 'false', output: 'I do not understand.'};
            executeDialog(dialog, context, print, callback);
          }
        }
      });
    }
  });
}

exports.matchGlobalDialogs = matchGlobalDialogs;

function matchChildDialogs(inRaw, inNLP, dialogs, context, print, callback, options, wordCorrection) {
  context.dialog.typeMatches = {};
  // context.dialog.typeInits = {};
  context.dialog.isFail = false;
  context.botUser.wordCorrection = wordCorrection;

  if(wordCorrection) {  // 오타수정 적용 후 처리
    context.botUser.currentDialog= context.botUser.wordCorrection_context_botUser_currentDialog;
    context.botUser._dialog= context.botUser.wordCorrection_context_botUser__dialog;
    context.dialog = context.botUser.wordCorrection_context_dialog;

    context.botUser.wordCorrection_context_botUser_currentDialog = null;
    context.botUser.wordCorrection_context_botUser__dialog = null;
    context.botUser.wordCorrection_context_dialog = null;
  }

  if(options && options.commonCallChild == 1) {options.commonCallChild = null; options.dontMatch = 1;}
  matchDialogs(inRaw, inNLP, context.bot.commonDialogs, context, print, function(matched, _dialog) {
    if(options && options.dontMatch) options.dontMatch = null;

    if(matched) {
      callback(true, _dialog);
    } else {
      matchDialogs(inRaw, inNLP, dialogs, context, print, function(matched, _dialog) {
        if (matched == true) {
          callback(matched, _dialog);
        } else {
          if(context.bot.useAutoCorrection != true || wordCorrection) {
            for (var i = 0; i < dialogs.length; i++) {
              var dialog = dialogs[i];
              if (dialog.input == undefined || dialog.name == NO_DIALOG_NAME) {
                // TODO  TASK.inRaw  추가
                dialog.inRaw = inRaw;
                dialog.inNLP = inNLP;

                if (dialog.task) {
                  dialog.task.inRaw = inRaw;
                  dialog.task.inNLP = inNLP;
                }
                if (context.botUser.currentDialog) {
                  context.botUser.currentDialog.inRaw = null;
                  context.botUser.currentDialog.inNLP = null;
                }

                var nextOptions;
                if (options) nextOptions = utils.merge(options, {current: context.botUser.currentDialog}, true);
                else nextOptions = {current: context.botUser.currentDialog};

                executeDialog(dialog, context, print, callback, nextOptions);
                context.dialog.isFail = true;
                callback(true, dialog);
                return;
              }
            }
          }

          if(context.bot.useAutoCorrection == true && !wordCorrection) {
            context.botUser.wordCorrection_context_botUser_currentDialog = context.botUser.currentDialog;
            context.botUser.wordCorrection_context_botUser__dialog = context.botUser._dialog;
            context.botUser.wordCorrection_context_dialog = context.dialog;
          }

          context.botUser.currentDialog = null;
          context.botUser._dialog = {};
          context.dialog = context.botUser._dialog;
          context.dialog.inRaw = inRaw;
          context.dialog.inNLP = inNLP;
          context.dialog.typeMatches = {};
          context.dialog.typeInits = {};

          matchDialogs(inRaw, inNLP, context.bot.dialogs, context, print, function(matched, _dialog) {
            if(matched) {
              callback(matched, _dialog);
            } else if(context.bot.useAutoCorrection == true && !wordCorrection) {
              var _inRaw = autoCorrection.correction(inRaw);
              type.processInput(context, _inRaw, function(_inNLP, _inDoc) {
                context.botUser.nlpCorrection = _inNLP;
                context.botUser.inRawCorrection = _inRaw;
                matchChildDialogs(_inRaw, _inNLP, dialogs, context, print, callback, options, true);
              });
            } else {
              if(context.bot.useQuibble ==  true) {
                context.dialog.isFail = true;
                // print(quibble.quibble(context));
                var dialog = {id: -1, name: 'quibble', input: 'false', output: quibble.quibble(context)};
                executeDialog(dialog, context, print, callback);
              } else if(context.bot.noDialog) {
                context.dialog.isFail = true;
                executeDialog(context.bot.noDialog, context, print, callback);
              } else {
                console.error('NO_DIALOG(답변없음)가 없습니다. 아래와 같이 설정바랍니다.\n답변없음:c<> 알아듣지 못하는 말입니다.');
                context.dialog.isFail = true;
                // print('학습되어 있지 않은 대화 입니다.');
                var dialog = {id: -1, name: 'no_dialog', input: 'false', output: '학습되어 있지 않은 대화 입니다.'};
                executeDialog(dialog, context, print, callback);
              }
              // callback(true, context.bot.noDialog);
            }
          }, options);
        }
      }, options);
    }
  }, options);
}

function matchDialogs(inRaw, inNLP, dialogs, context, print, callback, options) {
  if(options && options.dontMatch == 1) {callback(false);return;}

  if(context.botUser.intent && (context.botUser.userDialogs || context.botUser.dialogsetDialogs)) {
    var dialog;
    if(context.botUser.userDialogs) dialog = context.botUser.userDialogs[0];
    else if(context.botUser.dialogsetDialogs) dialog = context.botUser.dialogsetDialogs[0];

    var rateOffset = 0, countOffset = 0;
    if(context.intentOption) {
      if(options && options.child) rateOffset = context.intentOption.matchRateChildOffest;
      else rateOffset = context.intentOption.matchRateOffest;

      if(options && options.child) countOffset = context.intentOption.matchCountChildOffest;
      else countOffset = context.intentOption.matchCountOffest;
    }

    if(dialog && (dialog.matchRate > context.botUser.intent.matchRate + rateOffset ||
      dialog.matchCount > context.botUser.intent.matchCount + countOffset)) {
      executeDialog(dialog, context, print, callback);
      return;
    }
  }

  if(Array.isArray(dialogs)) {
    var eachMatched = false, intentMatched = false, intentDialogs = [];
    var inDoc = {};
    async.eachSeries(dialogs, function(dialog, cb) {

      var matchInput = function(input, _cb) {
        eachMatched = false;
        intentMatched = false;

        async.waterfall([
          function(cb2) {
            if(input === undefined || input === false || input === '' || dialog.name == NO_DIALOG_NAME ) {
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
            var array = null;
            if(input && input.regexp) {
              if ((array = inNLP.match(utils.concepRegExp(context, input.regexp))) != null) {
                if(array.length > 1) {
                  for(var i = 1; i < array.length; i++) {
                    inDoc[i.toString()] = array[i];
                  }
                }
                cb2(null, true);
              } else {
                cb2(true, false);
              }
            } else if(input && input instanceof RegExp) {
              if ((array = inNLP.match(utils.concepRegExp(context, input))) != null) {
                if(array.length > 1) {
                  for(var i = 1; i < array.length; i++) {
                    inDoc[i.toString()] = array[i];
                  }
                }
                cb2(null, true);
              } else {
                cb2(true, false);
              }
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && input.entities != undefined) {
              var eachMatched2 = false;

              if(Array.isArray(input.entities)) {
                for(var i in input.entities) {
                  for(key in context.botUser.entities) {
                      if(input.entities[i] == key){
                    // if(input.entities[i] == '@' + key || input.entities[i] == context.botUser.entities[key] + '@' + key) {
                      eachMatched2 = true;
                    }
                  }
                }
                if (eachMatched2) cb2(null, true);
                else cb2(true, false);
              } else {
                for(key in context.botUser.entities) {
                  // if(input.entities == '@' + key || input.entities == context.botUser.entities[key] + '@' + key) {
                if(input.entities == key){
                    eachMatched2 = true;
                  }
                }

                if (eachMatched2) cb2(null, true);
                else cb2(true, false);
              }
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(input && input.types != undefined) {
              var eachMatched2 = true;

              if(Array.isArray(input.types)) {
                async.eachSeries(input.types, function (type1, cb3) {
                  if(typeof type1 == 'string') {
                    var _type = context.bot.types[type1];
                    if(_type) type1 = _type;
                    else {
                      _type = context.global.types[type1];
                      if(_type) type1 = _type;
                    }
                  }

                  var type2 = taskModule.paramDefType(type1);           // TODO type1 없는 경우 디버겅 처리
                  // if (dialog.task == undefined) dialog.task = {};

                  if(typeof type2.typeCheck == 'string') {
                    var _typeCheck = context.bot.typeChecks[type2.typeCheck];
                    if(_typeCheck) type2.typeCheck = _typeCheck;
                    else {
                      _typeCheck = context.global.typeChecks[type2.typeCheck];
                      if(_typeCheck) type2.typeCheck = _typeCheck;
                    }
                  }

                  if(type2.typeCheck) {
                    // if(dialog.task && typeof dialog.task == 'string') {
                    //   var _task = context.bot.tasks[dialog.task];
                    //   if(_task) dialog.task = utils.clone(_task);
                    //   else {
                    //     _task = context.global.tasks[dialog.task];
                    //     if(_task) dialog.task = utils.clone(_task);
                    //   }
                    // }

                    inDoc = {};
                    executeType(inRaw, inNLP, type2, inDoc, context, function(inNLP, inDoc, _match) {
                      if(_match) cb3(null);
                      else {eachMatched2 = false; cb3(true);}
                    });
                  } else {
                    console.log('Type이 없습니다. ' + type1, context);
                    eachMatched2 = false; cb3(true);
                  }

                }, function (err) {
                  if (eachMatched2) cb2(null, true);
                  else cb2(true, false);
                })
              } else {
                var type1 = input.types;
                if(typeof type1 == 'string') {
                  var _type = context.bot.types[type1];
                  if(_type) type1 = _type;
                  else {
                    _type = context.global.types[type1];
                    if(_type) type1 = _type;
                  }
                }

                var type2 = taskModule.paramDefType(type1);           // TODO type1 없는 경우 디버겅 처리
                // if (dialog.task == undefined) dialog.task = {};

                if(typeof type2.typeCheck == 'string') {
                  var _typeCheck = context.bot.typeChecks[type2.typeCheck];
                  if(_typeCheck) type2.typeCheck = _typeCheck;
                  else {
                    _typeCheck = context.global.typeChecks[type2.typeCheck];
                    if(_typeCheck) type2.typeCheck = _typeCheck;
                  }
                }

                if(type2.typeCheck) {
                  // if(dialog.task && typeof dialog.task == 'string') {
                  //   var _task = context.bot.tasks[dialog.task];
                  //   if(_task) dialog.task = utils.clone(_task);
                  //   else {
                  //     _task = context.global.tasks[dialog.task];
                  //     if(_task) dialog.task = utils.clone(_task);
                  //   }
                  // }

                  inDoc = {};
                  executeType(inRaw, inNLP, type2, inDoc, context, function(inNLP, inDoc, _match) {
                    if (_match) cb2(null, true);
                    else cb2(true, false);

                  });
                } else {
                  console.log('Type이 없습니다. ' + type1, context);
                  cb2(true, false);
                }

                // if (eachMatched2) cb2(null, true);
                // else cb2(true, false);
              }

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
            if(input && input.intent) {
              if(context.botUser.intent && input.intent == context.botUser.intent.name) {
                intentMatched = true;
                cb2(null, true);
              }
              else cb2(true, false);
            } else {
              cb2(null, true);
            }
          },

          function(matched, cb2) {
            if(typeof input == 'string' || input.text) {
              var _matched = true;
              var _input;
              if(typeof input.text == 'string') {
                _input = input.text;
              }
              else _input = input;

              var words = _input.split(/\s/);
              for (var i = 0; i < words.length; i++) {
                var word = words[i];
                word = RegExp.escape(word);

                if(word.startsWith('~')) {
                  _matched = false;
                  var concepts = utils.findConcepts(context, word.substring(1));
                  for (var j = 0; j < concepts.length; j++) {
                    var concept = concepts[j];
                    concept = RegExp.escape(concept);
                    if(inNLP.search(new RegExp('(?:^|\\b|\\s)' + concept + '(?:$|\\b|\\s)', 'i')) != -1) {  // 포함이 아닌 정확히 매치로 수정 by com2best
                      _matched = true;
                      break;
                    }
                  }

                  if(!_matched) break;
                } else if(inNLP.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) == -1) {  // 포함이 아닌 정확히 매치로 수정 by com2best
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
          if(intentMatched && context.bot.contexts && Object.keys(context.bot.contexts).length > 0) {
          // if(intentMatched){
            intentDialogs.push(dialog);
            _cb(null);
          } else
            if(matched) {
            eachMatched = true; _cb(dialog);
          } else {
            eachMatched = false; _cb(null);
          }
        });
      };

      if(Array.isArray(dialog.input)) {
        async.eachSeries(dialog.input, function(input, cb3) {
          matchInput(input, function() {
            if(eachMatched) cb(dialog);
            else cb3(null);
          });
        }, function(err) {
          cb(null, dialog);
        })
      } else {
        matchInput(dialog.input, cb);
      }

    }, function(err){
      var _executeDialog = function(dialog) {
        if(dialog.output.up) {
          if (context.botUser.currentDialog && context.botUser.currentDialog.parent)
            dialog.parent = context.botUser.currentDialog.parent.parent;
          else if (context.botUser.lastDialog && context.botUser.lastDialog.parent)
            dialog.parent = context.botUser.lastDialog.parent;
        } else if(context.botUser.currentDialog && context.botUser.currentDialog.name != undefined && (dialog.output.call == context.botUser.currentDialog.name ||
          dialog.output.callChild == context.botUser.currentDialog.name)) {
          dialog.parent = context.botUser.currentDialog.parent;
        } else { // TODO 자기 자신으로 parent 참조하기 막기
          dialog.parent = context.botUser.currentDialog;
        }

        if(context.botUser.currentDialog) {
          dialog.top = context.botUser.currentDialog.top;
          // if(context.botUser.currentDialog.upCallback) dialog.upCallback = context.botUser.currentDialog.upCallback;
          // if(context.botUser.currentDialog.returnDialog) dialog.returnDialog = context.botUser.currentDialog.returnDialog;
        }

        var nextOptions;
        if(options && (options.prefix || options.output || options.postfix)) {
          nextOptions = {};
          if(options.prefix) nextOptions.prefix = options.prefix;
          if(options.post) nextOptions.post = options.postfix;
          if(options.output) nextOptions.output = options.output;
        }

        var _dialog = utils.cloneWithParent(dialog);
        if(_dialog.task && typeof _dialog.task == 'string') {
          var _task = context.bot.tasks[_dialog.task];
          if(_task) _dialog.task = utils.clone(_task);
          else {
            _task = context.global.tasks[_dialog.task];
            if(_task) _dialog.task = utils.clone(_task);
          }
          // } else {
          //   _dialog.task = utils.clone(_dialog.task);
        }

        _dialog.task = utils.mergeWithClone(_dialog.task, inDoc);

        _dialog.inRaw = _dialog.task.inRaw = inRaw;
        _dialog.inNLP = _dialog.task.inNLP = inNLP;
        // executeDialog(_dialog, context, print, callback, nextOptions);
        executeDialog(_dialog, context, print, callback, nextOptions);

        callback(true, err);
      }

      if(intentDialogs.length > 0) {
        if(intentDialogs.length == 1) {
          intentDialogs[0].context = null;
          _executeDialog(intentDialogs[0]);
        } else {
          var intentDialog;
          function matchContext(dialogs, context, customContext, intentDialogs, print, callback, options) {
            if(customContext.children && customContext.children.length > 0) {
              for(var i in customContext.children) {
                var child = customContext.children[i];

                if(child.dialogs && child.dialogs.length > 0) {
                  for(var j in intentDialogs) {
                    for(var k in child.dialogs) {
                      if (intentDialogs[j].id == child.dialogs[k].id) {
                        intentDialog = intentDialogs[j];
                        intentDialog.context = null;
                        context.botUser.context = child;
                        _executeDialog(intentDialog);
                        return true;
                      }
                    };
                  }
                } else if(child.items) {
                  var itemCheck = false, itemChecked;
                  for(var j in child.items) {
                    var item = child.items[j];
                    if(item.type == "entityItem") {
                      for(var key in context.botUser.entities) {
                        if(item.name == '@' + key || item.name == context.botUser.entities[key] + '@'+key) {
                          itemCheck = true;
                        }
                      }
                    }
                  }

                  if(itemCheck) {
                    return matchContext(dialogs, context, child, intentDialogs, print, callback, callback, options);
                  }
                } else if(context.dialog.inCurRaw && context.dialog.inCurRaw.indexOf(child.name) != -1) {
                  return matchContext(dialogs, context, child, intentDialogs, print, callback, callback, options);
                }
              }

              context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
                context.user.pendingCallback = null;
                matchContext(dialogs, context, customContext, intentDialogs, print, callback, options);
              };

              var question = '상담 가능한 다음 항목 중 골라주세요.\n>';
              for(var k in customContext.children) {
                if(k != 0) question += ',';
                question += customContext.children[k].name + ' ';
              }
              question += '\n\n처음은 "시작"을 입력해 주세요.';
              console.log(question);
              print(question);

              return true;
            } else {
              return false;
            }
          }

          var contextMatched = matchContext(dialogs, context, context.bot.contextTree, intentDialogs, print, callback, options);
          if(contextMatched) {
            callback(true, intentDialog);
          } else callback(false);
        }
      } else if(eachMatched) {
        var dialog = err;
        _executeDialog(dialog);
      } else callback(false);
    });
  } else {
    callback(false);
  }
}

exports.matchDialogs = matchDialogs;


// exports.matchContext = matchContext;

function executeDialog(dialog, context, print, callback, options) {
  if(dialog.name || dialog.input) {
    // console.log('executeDialog: ' + toDialogString(dialog) + ' options= ' + (options?options.prefix: ''), context);

    var contexts;
    if(context.botUser.contexts) contexts = context.botUser.contexts.map(function(i) { return i.name; });

    // if(dialog) console.log('[DIALOG_SEL]' + JSON.stringify({id: dialog.id, name: dialog.name, input: dialog.input,
    //     contexts: contexts, intent: context.botUser.intent,
    //     entities: context.botUser.entities}), context);
  }

  // context.botUser.currentDialog = null;
  context.user.pendingCallback = null;

  if(options && options.current) {
    if(options.current.inRaw) dialog.inRaw = options.current.inRaw;
    if(options.current.inRaw) dialog.inNLP = options.current.inNLP;

    if(options.current.output.repeat !== 1 && options.current.output.up !== 1) {
      // if(options.callChild && options.current.parent && options.current.parent.parent)
      //   dialog.parent = options.current.parent.parent;

      if(options.current.parent && options.current.parent.parent && dialog == options.current.parent.parent)
        dialog.parent = options.current.parent.parent.parent;
      else if(options.current.parent && dialog == options.current.parent)
        dialog.parent = options.current.parent.parent;
      else
        dialog.parent = options.current.parent;

      if(options.top) dialog.top = findDialog(null, context, options.top);
      else if(options.current.top) dialog.top = options.current.top;
      else dialog.top = options.current;
    }

    // if(options.current.output.upCallback) dialog.upCallback = options.current.output.upCallback;
    // else if(options.current.upCallback) dialog.upCallback = options.current.upCallback;

    if(options.current.output.upCallback) options.current.parent.upCallback = options.current.output.upCallback;

    // if(options.current.returnDialog) context.botUser.returnDialog = options.current.returnDialog;
    if(options.current.output.returnCall || options.current.output.returnCallChild) {
      context.botUser.returnCall = {};
      if(options.returnDialog) {
        var _dialog = findDialog(null, context, options.returnDialog);
        if(_dialog) context.botUser.returnCall.returnDialog = _dialog;
        else context.botUser.returnCall.returnDialog = options.current.parent;
      } else context.botUser.returnCall.returnDialog = options.current.parent;

      if(options.returnMethod) context.botUser.returnCall.returnMethod = options.returnMethod;
      if(options.returnPrefix) context.botUser.returnCall.returnPrefix = options.returnPrefix;
      if(options.returnPostfix) context.botUser.returnCall.returnPostfix = options.returnPostfix;
      if(options.returnOutput) context.botUser.returnCall.returnOutput = options.returnOutput;
    }
  }

  if(dialog.output == undefined && dialog.text) dialog.output = dialog.text;

  if(!(dialog.output && dialog.output.repeat && dialog.output.options && dialog.output.options.page) && !(options && options.page)) {
    context.dialog.page = null; context.dialog.numOfPage  = null;
  }

  async.waterfall([
    function(cb) {
      if (dialog.task) {
        if(!dialog.task.action) {
          if(dialog.task.template && typeof dialog.task.template == 'string') {
            var _template = context.bot.tasks[dialog.task.template];
            if(_template) dialog.task.template = utils.clone(_template);
            else {
              _template = context.global.tasks[dialog.task.template];
              if(_template) dialog.task.template = utils.clone(_template);
            }
          }

          if((typeof dialog.task == 'string' || dialog.task.name)) {
            var taskname;
            if(dialog.task.name) taskname = dialog.task.name;
            else taskname = dialog.task;

            var _task = context.bot.tasks[taskname];
            if(_task) dialog.task = utils.mergeWithClone(_task, dialog.task);
            else {
              _task = context.global.tasks[taskname];
              if(_task) dialog.task = utils.mergeWithClone(_task, dialog.task);
            }
          }
        }

        if (dialog.task.template || dialog.task.action) {
            taskModule.executeTask(dialog.task, context, function (_task, context) {
              dialog.task = _task;
            cb(null);
          }, print, {currentDialog: dialog});
        } else {
          // logger.debug('Task action 함수가 없습니다.');
          cb(null);
        }
      } else {
        cb(null);
      }
    },

    function(cb) {
      if(context.dialog.output) {
        dialog.output = context.dialog.output;
      }

      if(context.dialog.children) {
        dialog.children = context.dialog.children;
      }

      if(Array.isArray(dialog.output) && dialog.output.length == 1)
        dialog.output = dialog.output[0];

      cb(null);
    },

    function(cb) {

      var nextOptions = {};
      if(options && (options.prefix || options.output || options.postfix || options.commonCallChild)) {
        // if(dialog.output.constructor == String) dialog.output = {output: dialog.output, options: {}};
        // else if(!nextOptions) nextOptions = {};

        // if(!nextOptions) nextOptions = {};
        if((!dialog.output.options || !dialog.output.options.prefix) && options.prefix) nextOptions.prefix = options.prefix;
        if((!dialog.output.options || !dialog.output.options.postfix) && options.post) nextOptions.post = options.postfix;
        if((!dialog.output.options || !dialog.output.options.output) && options.output) nextOptions.output = options.output;
        if(options.commonCallChild) nextOptions.commonCallChild = options.commonCallChild;
      }

      if(options && options.callChild === 1) {
        context.botUser.currentDialog = dialog;

        matchChildDialogs(dialog.inRaw, dialog.inNLP, dialog.children, context, print, callback, nextOptions);
        cb(true);

      } else if(dialog.output instanceof Function) {
        dialog.output(dialog, context, print, callback);
        cb(true);

      } else if(dialog.output && dialog.output.constructor == Object && dialog.output.text == undefined) {
        var _dialog, _output;

        var _execDialog = function(_dialog, outputName) {
          if(_dialog || (_dialog = context.bot.startDialog)) {
            if (dialog.output.options) nextOptions = utils.mergeWithClone(dialog.output.options, nextOptions);
            // else if(dialog.output.options) nextOptions = utils.clone(dialog.output.options);

              if(context && context.botUser && context.botUser.socket)
              {
                  context.botUser.socket.emit('send_msg', JSON.stringify({ type: 'dialog', data: { dialogId: _dialog.id }}));
              }
            executeDialog(_dialog, context, print, callback, utils.merge(nextOptions, {current: dialog}, true));
            cb(true);
          } else {
            console.log(outputName + ': ' + dialog.output.call + ' Dialog를 찾을 수 없습니다.', context);
            if (process.env.NODE_ENV == 'development')
              _output = outputName + ': ' + dialog.output.call + ' Dialog를 찾을 수 없습니다.';
            else
              _output = context.global.messages.userError;
            cb(null, _output);
          }
        }

        if(dialog.output.return == 1 && context.botUser.returnCall) {
          _dialog = context.botUser.returnCall.returnDialog;

          if(!nextOptions) nextOptions = {};
          if(context.botUser.returnCall.returnMethod == 'callChild') nextOptions.callChild = 1;
          if(context.botUser.returnCall.returnPrefix) nextOptions.prefix = context.botUser.returnCall.returnPrefix;
          if(context.botUser.returnCall.returnPostfix) nextOptions.postfix = context.botUser.returnCall.returnPostfix;
          if(context.botUser.returnCall.returnOutput) nextOptions.output = context.botUser.returnCall.returnOutput;

          context.botUser.returnCall = null;

          _execDialog(_dialog, 'return');
        } else if (dialog.output.call) {
          _dialog = findDialog(null, context, dialog.output.call);

          // if(dialog.output.upCallback) dialog.upCallback = dialog.output.upCallback;

          // TODO call에서 하위 dialog.task 가 string 인경우 잘 안됨
          _execDialog(_dialog, 'call');
        } else if (dialog.output.callChild) {
          _dialog = findDialog(null, context, dialog.output.callChild);

          // if(dialog.output.upCallback) dialog.upCallback = dialog.output.upCallback;
          if(!dialog.output.options) dialog.output.options = {};
          dialog.output.options.callChild = 1;
          _execDialog(_dialog, 'callChild');
        } else if (dialog.output.callGlobal) {
          _dialog = findGlobalDialog(null, context, dialog.output.callGlobal);

          _execDialog(_dialog, 'callGlobal');
        } else if (dialog.output.returnCall) {
          _dialog = findDialog(null, context, dialog.output.returnCall);

          _execDialog(_dialog, 'returnCall');
        } else if (dialog.output.returnCallChild) {
          _dialog = findDialog(null, context, dialog.output.returnCallChild);

          if(!dialog.output.options) dialog.output.options = {};
          dialog.output.options.callChild = 1;
          _execDialog(_dialog, 'returnCallChild');
        } else if (dialog.output.up) {

          _dialog = findUpDialog(dialog, context, print, callback);

          if(_dialog.upCallback) {
            _dialog.upCallback(dialog, context, function(__dialog) {
              if(__dialog) {
                executeDialog(__dialog, context, print, callback, utils.merge(dialog.output.options, {current: dialog}));
                cb(true);
              } else {
                _execDialog(_dialog, 'up');
              }
            });
          } else {
            _execDialog(_dialog, 'up');
          }
        } else if (dialog.output.back) {

          _execDialog(_dialog, 'back');
        } else if (dialog.output.repeat) {
          _dialog = context.botUser.currentDialog;

          _execDialog(_dialog, 'repeat');
        } else {
          cb(null, dialog.output);
          // _dialog = dialog.output;
        }

      } else if (Array.isArray(dialog.output)) {
        var matchedOutput = undefined, outputs = [];
        async.eachSeries(dialog.output, function(output, cb2) {
          if(output.if) {
            if(output.if.constructor == String) {
              if (eval(output.if)) {
                matchedOutput = output;
                cb2(true);
              } else cb2(null);
            } else if(output.if instanceof Function) {
              output.if(dialog, context, function(matched) {
                if(matched) {
                  matchedOutput = output;
                  cb2(true);
                } else cb2(null);
              })
            } else {
              cb2(null);
            }
          } else {
            if(output.constructor == String) {
              outputs.push(output);
              cb2(null);
            } else if(output.output) {
              outputs.push(output.output);
              cb2(null);
            } else if(output.kind == 'Action') {
              matchedOutput = output;
              cb2(true);
            } else if(output != undefined) {
              outputs.push(output);
              // matchedOutput = output;
              cb2(null);
            } else {
              cb2(null);
            }
          }
        }, function(err) {
          if(matchedOutput) {
            var output = matchedOutput;
            if(output.kind == 'Action') {
              output.output = utils.cloneWithParent(output);
            }

            var isAction = false, isPreCallback = false, isPostCallback = false;
            if(output.task !== undefined) {
              isAction = output.task.action != undefined;
              isPreCallback = output.task.preCallback != undefined;
              isPostCallback = output.task.postCallback != undefined;
            }

            if(output.task && dialog.task) output.task = utils.merge(output.task, dialog.task);
            else if(!output.task && dialog.task) output.task = utils.cloneWithParent(dialog.task);

            if(output.task !== undefined) {
              if(!isAction) output.task.action = undefined;
              if(!isPreCallback) output.task.preCallback = undefined;
              if(!isPostCallback) output.task.postCallback = undefined;
            }

            output.inRaw = dialog.inRaw;
            output.inNLP = dialog.inNLP;

            if(output.task) {
              output.task.inRaw = dialog.inRaw;
              output.task.inNLP = dialog.inNLP
            }
            if(output.options) nextOptions = utils.mergeWithClone(output.options, nextOptions);
            // else if(output.options) nextOptions = utils.clone(output.options);
            executeDialog(output, context, print, callback, utils.merge(nextOptions, {current: dialog}));
            cb(true);
            // cb(null, ifMatch);
          } else {
            if(outputs.length > 0) {
              var index = Math.floor(Math.random() * outputs.length);
              cb(null, outputs[index]);
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
          var taskText = (dialog.task ? dialog.task.text : undefined);
          if (dialog.task)
            dialog.task = utils.merge(dialog.task, output);
          else
            dialog.task = utils.clone(output);

          dialog.task.text = taskText;
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

        if(options && options.page) {
          if(Number(options.page)) {
            context.dialog.page = Number(options.page);
          } else if(options.page === 'pre') {
            if(context.dialog.page && context.dialog.page > 1)
              context.dialog.page = context.dialog.page - 1;
          } else if(options.page === 'next') {
            if(context.dialog.page && context.dialog.numOfPage && context.dialog.page < context.dialog.numOfPage)
              context.dialog.page = context.dialog.page + 1;
          }
        }

        if(dialog.task && dialog.task.text) {
          _output = dialog.task.text;
        }

        var userOut = type.processOutput(dialog.task, context, _output);

        if(output.image || output.buttons || output.items || output.result)
        {
            dialog.task = utils.merge(dialog.task, output);
        }

        context.botUser._currentDialog = dialog;    // 이게 진짜 현재 다이얼로그


        print(userOut, dialog.task);

        dialog.dialogType = context.dialog.dialogType;

         userDilaog.addDialog(dialog.inRaw || context.dialog.inCurRaw || context.dialog.inRaw, userOut, context.dialog.isFail, dialog, context, function() {
          cb(null, _output);
        });
      } else if (output.if) {
        cb(null, output);
      } else if(output.image || output.buttons || output.items || output.result) {
        dialog.task = utils.merge(dialog.task, output);
        print('', dialog.task);
      } else {
        cb(null);
      }
    },

    function(output, cb) {
      if(dialog.task && dialog.task.err) {
        if(process.env.NODE_ENV == 'development')
          print(dialog.task.err);
        else
          print(context.global.messages.userError);
      } else {
        // dialog.output.options = null;
        context.botUser.currentDialog = dialog;   // 이건 사실 이전 다이얼로그로서 역활
        context.botUser.lastDialog = dialog;
        if(context.dialog.output) context.dialog.output = null;
        if(context.dialog.children) context.dialog.children = null;

        // dialog.inRaw = null;
        // dialog.inNLP = null;

        var _dialog = dialog;

        // logger.debug('PendingDialog: ' + toDialogString(_dialog));

        if(Array.isArray(_dialog.children)) {
          context.user.pendingCallback = function(inRaw, inNLP, inDoc, context, print) {
            matchChildDialogs(inRaw, inNLP, _dialog.children, context, print, callback);
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
    else if(dialog.output instanceof Object) {
      try {
        str += 'output=' + JSON.stringify(dialog.output) + ' ';
      } catch(error) {
      }
    }
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
        try {
          type.preType(task, context, type, function (_task, _context, _type) {
            cb4(null);
          });
        } catch (e) {
          console.log(e.stack, context);
        }
      } else {
        cb4(null);
      }
    },

    function(cb4) {
      if(context.dialog.typeMatches == undefined) context.dialog.typeMatches = {};

      if (context.dialog.typeMatches[type.name] == undefined) {
        var inText;

        if(type.init === true && context.dialog.typeInits[type.name] !== true) {
          inText = (type.raw) ? context.dialog.inRaw : context.dialog.inNLP;
          context.dialog.typeInits[type.name] = true;
        // } else if(type.dialog === true) {
        //   inText = (type.raw) ? (inRaw || context.dialog.inRaw) : (inNLP || context.dialog.inNLP);
        } else {
          inText = (type.raw) ? inRaw : inNLP;
        }

        try {
          type.typeCheck(inText, type, task, context, function (inNLP, task, _matched) {

            // logger.debug('matchDialogs: [TYPE] ' + toDialogString(dialog) +
            //   ' CHECK TYPE=' + type.name + ' ' + (_matched ? 'matched' : 'not matched'));

            if (_matched) {
              if (task[type.name]) {
                if (type.save == undefined || type.save == true) {
                  context.dialog[type.name] = task[type.name];
                  context.dialog.typeMatches[type.name] = task[type.name];
                  if(type.mongo && type.mongo.model == 'dialogsetdialogs')
                  {
                      context.dialog.dialogType = 'qna';
                  }
                }
              }

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
              if (type.failSave == undefined || type.failSave == true) {
                context.dialog[type.name] = null;
              }
              eachMatched2 = false;
              cb4(true, false);
            }
          });
        } catch (e) {
          console.log(e.stack, context);
        }
      } else if (context.dialog.typeMatches[type.name] != undefined) {
        if(type.save == undefined || type.save == true) task[type.name] = context.dialog.typeMatches[type.name];
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


function dialogPattern(pattern, params, context) {
  var patternDialog;
  if('string' == typeof pattern) patternDialog = context.bot.patterns[pattern];
  else patternDialog = pattern;

  return changeDialogPattern(patternDialog, params);
}

function changeDialogPattern(obj, params) {
  if ('string' == typeof obj) {
    var matched = obj.match(/^{(.*)}$/);
    if (matched != null && params[matched[1]]) {
      return params[matched[1]];
    } else {
      obj = obj.replace(/{(.*)}/g, function(match, p1) {
        return params[p1];
      });

      return obj;
    }
  }

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Array
  if (obj instanceof Array) {
    for (var i = 0, len = obj.length; i < len; i++) {
      obj[i] = changeDialogPattern(obj[i]);
    }
    return obj;
  }

  // Handle Object
  if (obj instanceof Object) {
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) obj[attr] = changeDialogPattern(obj[attr]);
    }
    return obj;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

exports.changeDialogPattern = changeDialogPattern;


function sympathize(inRaw, inNLP, context, print, callback) {
  print('응');
  callback();
}

exports.sympathize = sympathize;
