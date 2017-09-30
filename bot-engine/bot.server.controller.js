var net = require('net');
var path = require('path');
var _ = require('lodash');
var async = require('async');

var utils = require(path.resolve('./bot-engine/action/common/utils'));
var logger = require(path.resolve('./config/lib/logger'));
var dialog = require(path.resolve('./bot-engine/action/common/dialog'));
var command = require(path.resolve('./bot-engine/action/common/command'));
var factModule = require(path.resolve('./bot-engine/action/common/facts'));
var contextModule = require(path.resolve('./bot-engine/engine/common/context'));
var dialogsetModule = require(path.resolve('./bot-engine/engine/dialogset/dialogset'));

var botProcess = require('./_action.server.controller');

(function()
{
    var context = undefined;
    var outCallback = undefined;
    var channel = undefined;
    var print = function(out, task)
    {
        var startTime = new Date();
        var endTime = new Date();
        logger.systemLog("Output (" + (endTime-startTime) + 'ms) - ' + out);

        if(task && context && context.bot && context.bot.commonButtons && context.botUser && context.botUser._currentDialog && context.botUser._currentDialog.name != context.bot.startDialog.name)
        {
            if(task.buttons && (task.buttons.length < 2 || _.isEqual(task.buttons.slice(task.buttons.length - 2, task.buttons.length), context.bot.commonButtons) == false))
                task.buttons = task.buttons.concat(context.bot.commonButtons);
            else if(task.result && task.result.buttons && (task.result.buttons.length < 2 || _.isEqual(task.result.buttons.slice(task.result.buttons.length - 2, task.result.buttons.length), context.bot.commonButtons) == false))
                task.result.buttons = task.result.buttons.concat(context.bot.commonButtons);
        }

        var pre = (context.botUser.curBotId && context.botUser.curBotName && context.botUser.curBotId != botName ? context.botUser.curBotName + ': ' : undefined);

        if(task && task.text)
            out = task.text;

        if(channel == 'ios' || channel == 'android')
        {
            outCallback(out, task);
        }
        else
        {
            if(out.indexOf('|') == -1)
            {
                outCallback(pre == undefined ? out : pre + '"' + out + '"', task);
            }
            else
            {
                var arr = out.split('|');
                outCallback(pre == undefined ? arr[0] : pre + '"' + arr[0] + '"', task);
            }
        }
    };

    exports.botProc = function(botName, _channel, user, inTextRaw, json, _outCallback, options)
    {
        outCallback = _outCallback;
        channel = _channel;
        // TODO 개발용
        // 단순히 갱신용인가?
        // dialog = utils.requireNoCache(path.resolve('./bot-engine/action/common/dialog'));

        var inTextNLP = undefined;
        var inDoc = undefined;
        async.waterfall([
            function(cb)
            {
                //여기서 얻는 context가 Task에서 파라미터로 받는 context이다.
                logger.systemLog('[BotEngine] getContext [Started]');
                contextModule.getContext(botName, channel, user, options, function(_context)
                {
                    context = _context;

                    logger.systemLog('[BotEngine] getContext [End]');
                    cb(null);
                });
            },

            function(cb)
            {
                //사용자 입력을 자연어 처리 하는 부분.
                logger.systemLog("사용자 입력 - " + inTextRaw);
                var type = utils.requireNoCache(path.resolve('./bot-engine/action/common/type'));

                type.processInput(context, inTextRaw, function(_inTextNLP, _inDoc)
                {
                    logger.systemLog("자연어 처리 - " + _inTextNLP);
                    logger.systemLog(context.botUser.nlu);
                    inTextNLP = _inTextNLP;
                    context.task = utils.merge(_inDoc, json);
                    cb(null);
                });
            },

            function(cb)
            {
                if (context.botUser && context.botUser.nlp)
                {
                    context.botUser.sentenceInfo = dialogsetModule.analyzeSentence(inTextRaw, null, context.botUser.nlpAll);

                    if(context.bot.useMemoryFacts)
                    {
                        // 지식학습 그래프에서 쓰는 로직.
                        factModule.memoryFacts(inTextRaw, context, function (_task, _context)
                        {
                            if(_task && _task.numAffected && _task.numAffected.upserted)
                            {
                                console.log('[FACT_ADD]' + JSON.stringify(_task.doc));
                                print('말씀하신 내용을 학습했어요.');
                                cb(true);
                                return;
                            }
                            cb(null);
                        });
                    }
                    else
                    {
                        cb(null);
                    }
                }
                else
                {
                    cb(null);
                }
            },

            function(cb)
            {
                context.dialog.inCurRaw = inTextRaw;
                context.dialog.inCurNLP = inTextNLP;

                if(inTextRaw.startsWith(':'))
                {
                    command.command(inTextRaw, inTextNLP, context, print, function(matched)
                    {
                        if(matched)
                            cb(true);
                        else
                            cb(null);
                    });
                }
                else if(context.user.pendingCallback)
                {
                    if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true && inTextRaw.search(/(처음|메뉴)/g) != -1 || inTextRaw.startsWith(':'))
                    {
                        context.user.pendingCallback = null;
                        context.user.pendingType = null;
                        cb(null);
                    }
                    else
                    {
                        context.user.pendingCallback(inTextRaw, inTextNLP, inDoc, context, print, print);
                        cb(true);
                    }
                }
                else if(context.bot.dialogs)
                {
                    context.botUser._dialog = {};
                    context.dialog = context.botUser._dialog;

                    context.dialog.inRaw = inTextRaw;
                    context.dialog.inNLP = inTextNLP;

                    if(context.bot.bMultiSentence && !(context.botUser.sentenceInfo.sentenceType == 1 || context.botUser.sentenceInfo.sentenceType == 2 ||context.botUser.sentenceInfo.sentenceType == 3))
                    {
                        // 그냥 응 출력함...
                        dialog.sympathize(inTextRaw, inTextNLP, context, print, function()
                        {
                            cb(true);
                        })
                    }
                    else
                    {
                        dialog.matchGlobalDialogs(inTextRaw, inTextNLP, context.bot.dialogs, context, print, function(matched, _dialog)
                        {
                            if(matched)
                            {
                                if(_dialog) console.log('[DIALOG_SEL]' + JSON.stringify({id: _dialog.id, name: _dialog.name, input: _dialog.input,
                                    context: context.botUser.context ? context.botUser.context.path : '', intent: context.botUser.intent,
                                    entities: context.botUser.entities}));

                                if(_dialog && context.bot.startDialog.name == _dialog.name)
                                {
                                    context.botUser.currentDialog = null;
                                }

                                cb(true);
                            }
                            else
                            {
                                cb(null);
                            }
                        });
                    }
                }
                else
                {
                    cb(null);
                }
            },

            function(cb)
            {
                if(context.bot.dialogServer && context.bot.dialogServer.chatScript == true)
                {
                    var chatscriptSocket = net.createConnection(options.chatServerConfig, function()
                    {
                        chatscriptSocket.write(user+'\x00'+ /*botName*/ '' +'\x00'+inTextNLP+'\x00');
                    });

                    chatscriptSocket.on('data', function(data)
                    {    // on receive data from chatscriptSocket
                        var chatserverOut = data.toString();

                        logger.debug("챗서버 답변>> " + chatserverOut);

                        botProcess.processChatserverOut(context, chatserverOut, inTextNLP, inTextRaw, inDoc, print, print)
                    });

                    chatscriptSocket.on('end', function()
                    {       // on end from chatscriptSocket
                        console.log('disconnected from server');
                    });

                    chatscriptSocket.on('error', function(err)
                    {  // on error from chatscriptSocket
                        console.log('error from server ' + err +' '+ chatscriptSocket.address()[1]);
                    });

                    cb(null);
                }
                else
                {
                    cb(null);
                }
            }
        ]);
    };
})();
