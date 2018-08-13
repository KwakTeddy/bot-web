var net = require('net');
var path = require('path');
var botProcess = require('../controllers/_action.server.controller');
var tough = require('tough-cookie');
var _ = require('lodash');
var utils = require(path.resolve('./engine/bot/action/common/utils'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));
var dialog = require(path.resolve('engine/bot/action/common/dialog'));
var async = require('async');
var fs = require('fs');
var command = require(path.resolve('engine/bot/action/common/command'));
var botModule = require(path.resolve('./engine/bot.js'));
var factModule = require(path.resolve('engine/bot/action/common/facts'));
var toneModule = require(path.resolve('engine/bot/action/common/tone'));
var contextModule = require(path.resolve('engine/bot/engine/common/context'));
var dialogsetModule = require(path.resolve('engine/bot/engine/dialogset/dialogset'));

var util = require('util'); //temporary

var chatSocketConfig = {port: 1024, host: 'localhost', allowHalfOpen: true};

var mongoose = require('mongoose'),
    BotUser = mongoose.model('BotUser');

var redis = require('redis');
var cache;
// try {
//   cache = redis.createClient(config.redis.port, config.redis.host);
// } catch(e) {
// }

exports.write = write;
function write(channel, from, to, text, json, successCallback, errorCallback, endCallback) {
    botProc(to, channel, from, text, json, successCallback, chatSocketConfig);
};

exports.botProc = botProc;

var botSocket;

exports.setBotSocket = function(socket) {botSocket = socket};

// var consoleLog = console.log;
// var consoleError = console.error;
// var consoleTrace = console.trace;
//
// console = {};
// console.log = function(out, context) {
//   process.stdout.write(out+'\n');
//   if(context && context.botUser && context.botUser.socket && context.botUser.dev === true)
//     context.botUser.socket.emit('send_msg', ":log \n" + out +"\n");
// }
//
// console.error = function(out) {
//     consoleError(out);
//     if(botSocket) botSocket.emit('send_msg', ":log \n" + (out.stack ? out.stack : out) +"\n");
// }
//
// console.trace = function(out, t) {
//   consoleTrace(out);
//   if(botSocket) botSocket.emit('send_msg', ":log \n" + out +"\n");
// }
//
console.tlog = function(out, context) {
    console.log(out+'\n');
    if(context && context.botUser && context.botUser.socket && context.botUser.dev === true)
        context.botUser.socket.emit('send_msg', ":log \n" + out +"\n");
}

function botProc(botName, channel, user, inTextRaw, json, outCallback, options, socket) {
    // TODO 개발용
    dialog = utils.requireNoCache(path.resolve('engine/bot/action/common/dialog'));

    var startTime = new Date();
    var print = function(_out, _task) {
        // var botUserStr = JSON.stringify(context.botUser, utils.censor(context.botUser));
        // cache.set(context.botUser.botUserName, botUserStr, function(err, data) {
        //   cb(null);
        // });

        var endTime = new Date();
        console.tlog("Output (" + (endTime-startTime) + 'ms)>> ' + _out + "\n", context);

        // toneModule.toneSentence(_out, context.botUser.tone || '해요체', function(out) {
        //   _out = out;

        // if(_task && _task.photoUrl && !_task.photoUrl.startsWith('http')) {
        //   _task.photoUrl = (process.env.HTTP_HOST ? process.env.HTTP_HOST : '') + _task.photoUrl;
        // }

        if(_task && context && context.bot && context.bot.commonButtons &&
            context.botUser && context.botUser._currentDialog &&
           context.bot.startDialog && context.botUser._currentDialog.name != context.bot.startDialog.name) {

            if(_task.buttons && (_task.buttons.length < 2 ||
                    _.isEqual(_task.buttons.slice(_task.buttons.length - 2, _task.buttons.length), context.bot.commonButtons) == false))
                _task.buttons = _task.buttons.concat(context.bot.commonButtons);
            else if(_task.result && _task.result.buttons && (_task.result.buttons.length < 2 ||
                    _.isEqual(_task.result.buttons.slice(_task.result.buttons.length - 2, _task.result.buttons.length), context.bot.commonButtons) == false))
                _task.result.buttons = _task.result.buttons.concat(context.bot.commonButtons);
        }

        var pre = (context.botUser.curBotId && context.botUser.curBotName && context.botUser.curBotId != botName ?
            context.botUser.curBotName + ': ' : undefined);

        if(_task && _task.text) _out = _task.text;

        if(channel == 'ios' || channel == 'android') {
            outCallback(_out, _task);
        } else {
            if(_out.indexOf('|') == -1) outCallback(pre == undefined ? _out : pre + '"' + _out + '"', _task);
            else {
                var arr = _out.split('|');
                _task.voice = arr[1];
                outCallback(pre == undefined ? arr[0] : pre + '"' + arr[0] + '"', _task);
            }
        }
        // });
    };

    var context, inTextNLP, inDoc;
    async.waterfall([

        function(cb) {
            contextModule.getContext(botName, channel, user, options, function(_context) {
                context = _context;
                if(context.bot.language == undefined) context.bot.language = options.language || 'ko';
                if(socket && options && options.dev === true) {
                    context.botUser.socket = socket;
                    context.botUser.dev = true;
                } else {
                    context.botUser.socket = undefined;
                    context.botUser.dev = undefined;
                }

              cb(null);
            });
        },
        function(cb) {
            // 현재 발화의 대답이 중복인 경우, 중복된 발화의 category들을 저장하는 변수 (dsyoon)
            if (context.botUser["nlu"] == undefined || context.botUser["nlu"] == null) context.botUser["nlu"] = {};
            if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};

            // dialog를 저장한다.
            if (context.botUser.nlu["dialog"] == undefined || context.botUser.nlu["dialog"] == null) context.botUser.nlu["dialog"] = {};

            // 발화의 상태를 history로 저장한다
            if (context.botUser.nlu.contextInfo["contextHistory"] == undefined || context.botUser.nlu.contextInfo["contextHistory"] == null) context.botUser.nlu.contextInfo["contextHistory"] = [];
            if (context.botUser.nlu.contextInfo["matchContextHistory"] == undefined || context.botUser.nlu.contextInfo["matchContextHistory"] == null) context.botUser.nlu.contextInfo["matchContextHistory"] = [];
            // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
            if (context.botUser.nlu.contextInfo["answerHistory"] == undefined || context.botUser.nlu.contextInfo["answerHistory"] == null) context.botUser.nlu.contextInfo["answerHistory"] = [];
            // 사용자 발화를 history로 저장한다
            if (context.botUser.nlu.contextInfo["queryHistory"] == undefined || context.botUser.nlu.contextInfo["queryHistory"] == null) context.botUser.nlu.contextInfo["queryHistory"] = [];
            // 현재 발화의 상태
            if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};

            // 현재 발화의 매치 정보
            context.botUser.nlu["matchInfo"] = {};
            context.botUser.nlu.matchInfo["qa"] = [];
            context.botUser.nlu.matchInfo["contextNames"] = {};
            context.botUser.nlu.matchInfo["contexts"] = {};
            context.botUser.nlu.matchInfo["topScoreCount"] = 0;
            cb(null);
        },
        function(cb) {
            context.botUser.nlu.sentence = inTextRaw;
            console.tlog("Input>> " + inTextRaw, context);
            inTextRaw = inTextRaw.replace(/^\s+|\s+$/g,"");

            // 현재 발화에 대한 자연어 처리
            var type = utils.requireNoCache(path.resolve('./engine/bot/action/common/type'));
            type.processInput(context, inTextRaw, function(_inTextNLP, _inDoc) {
                console.tlog("NLP>> " + _inTextNLP, context);
                console.tlog("NLU>> " + JSON.stringify(context.botUser.nlu), context);
                inTextNLP = _inTextNLP;
                context.task = utils.merge(_inDoc, json);
                cb(null);
            });
        },

        function(cb) {
            if (context.botUser && context.botUser.nlp) {
                // 기존 개발 의도는 분석된 형태소 조합을 이용해서 의미를 찾기위한 함수였던 것 같다.
                context.botUser.sentenceInfo = dialogsetModule.analyzeSentence(inTextRaw, null, context.botUser.nlpAll);

                if(context.bot.useMemoryFacts) {
                    factModule.memoryFacts(inTextRaw, context, function (_task, _context) {
                        //if(_task && _task.numAffected && _task.numAffected.upserted) {
                        if(_task && _task.numAffected && (_task.numAffected.ok == 1 && _task.numAffected.n > 0)) {
                            // _task.numAffected.nModified = 0: insert, _task.numAffected.nModified > 0: update
                            console.log('[FACT_ADD]' + JSON.stringify(_task.doc));
                            if (context.bot.language == "zh") {
                                print('我学到了你说的话。');
                            } else if (context.bot.language == "en") {
                                print("I understand.");
                            } else {
                                print('말씀하신 내용을 학습했어요.');
                            }
                            cb(true);
                            return;
                        }
                        cb(null);
                    });
                } else {
                    cb(null);
                }
            } else {
                cb(null);
            }
        },

        function(cb) {
            context.dialog.inCurRaw = inTextRaw;
            context.dialog.inCurNLP = inTextNLP;

            if(inTextRaw.startsWith(':')) {
                command.command(inTextRaw, inTextNLP, context, print, function(matched) {
                    if(matched) cb(true);
                    else cb(null);
                });
            } else if(context.user.pendingCallback) {
                if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true &&
                    inTextRaw.search(/(처음|메뉴)/g) != -1 || inTextRaw.startsWith(':')) {
                    context.user.pendingCallback = null;
                    context.user.pendingType = null;
                    cb(null);
                } else {
                    context.user.pendingCallback(inTextRaw, inTextNLP, inDoc, context, print, print);
                    cb(true);
                }
            } else if(context.bot.dialogs) {
                // context.botUser.currentDialog = null;

                context.botUser._dialog = {};
                context.dialog = context.botUser._dialog;

                context.dialog.inRaw = inTextRaw;
                context.dialog.inNLP = inTextNLP;

                if(context.bot.bMultiSentence &&
                    !(context.botUser.sentenceInfo.sentenceType == 1 || context.botUser.sentenceInfo.sentenceType == 2 ||context.botUser.sentenceInfo.sentenceType == 3)) {
                    dialog.sympathize(inTextRaw, inTextNLP, context, print, function() {
                        cb(true);
                    })
                } else {

                    // var isFirst = false;
                    dialog.matchGlobalDialogs(inTextRaw, inTextNLP, context.bot.dialogs, context, print, function(matched, _dialog) {
                        if(matched) {
                            if(_dialog) {
                                console.log('[DIALOG_SEL]' + JSON.stringify({id: _dialog.id, name: _dialog.name, input: _dialog.input,
                                    context: context.botUser.context ? context.botUser.context.path : '', intent: context.botUser.intent,
                                    entities: context.botUser.entities}));

                                var mappedDialog = {id: _dialog.id, name: _dialog.name, input: _dialog.input,
                                    context: context.botUser.context ? context.botUser.context.path : '', intent: context.botUser.intent,
                                    entities: context.botUser.entities};
                                context.botUser.nlu.dialog = mappedDialog;
                            }

                            if(_dialog && context.bot.startDialog && context.bot.startDialog.name == _dialog.name) {
                                context.botUser.currentDialog = null;
                            }

                            cb();
                        }
                        else cb(null);

                    })
                }
            } else {
                cb(null);
            }
        },

        function(cb) {
            if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true) {
                var chatscriptSocket = net.createConnection(options.chatServerConfig, function(){
                    chatscriptSocket.write(user+'\x00'+ /*botName*/ '' +'\x00'+inTextNLP+'\x00');
                });

                chatscriptSocket.on('data', function(data) {    // on receive data from chatscriptSocket
                    var chatserverOut = data.toString();

                    logger.debug("챗서버 답변>> " + chatserverOut);

                    botProcess.processChatserverOut(context, chatserverOut, inTextNLP, inTextRaw, inDoc, print, print)
                });

                chatscriptSocket.on('end', function() {       // on end from chatscriptSocket
                    console.log('disconnected from server');
                });

                chatscriptSocket.on('error', function(err) {  // on error from chatscriptSocket
                    console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
                });

                cb(null);
            } else {
                cb(null);
            }
        }
    ]);
}
