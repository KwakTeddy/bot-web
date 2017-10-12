require('./model-loader.js');

var path = require('path');
var async = require('async');
var logger = require(path.resolve('./config/lib/logger.js'));
var utils = require('./utils/utils.js');

var AsyncProcess = require('./utils/async-process/core.js');
var nlpManager = require('./nlp-manager.js');
var contextManager = require('./context-manager.js');

var entity = require('./nlu/entity.js');

var socketReceiver = require(path.resolve('./bot-engine/modules/receiver/socket-receiver.js'));

(function()
{
    var Core = function()
    {
        this.app;
    };

    Core.prototype.initialize = function(app, startServer)
    {
        var ap = new AsyncProcess(2);

        logger.systemLog('\n====================== Bot Engine Initialize [START]');
        ap.done(function()
        {
            logger.systemLog('====================== Bot Engine Initialize [END]');
            startServer();
        });

        this.app = app;
        socketReceiver.initialize(this, app.io, ap.makeAsyncProcess());
        nlpManager.initialize('ko', ap.makeAsyncProcess());
    };

    Core.prototype.process = function(requestData, responseCallback)
    {
        var language = requestData.language;
        var botId = requestData.botId;
        var userId = requestData.userId;
        var channel = requestData.channel || 'socket';
        var options = requestData.options || {};
        var rawText = requestData.rawText;

        // 유저 인풋이 커맨드인 경우가 있다. 시스템 커맨드. 그건 NLP 처리 될 필요가 없다.

        if(rawText.startsWith(':'))
        {
            //커맨드를 실행시킨다.
            console.log('커맨드 실행합니다');
        }
        else
        {
            var doc = { entities: {} };
            var context = undefined;
            var nlpInput = '';

            async.waterfall([
                function(next)
                {
                    contextManager.makeContext(botId, userId, channel, options, function(_context)
                    {
                        context = _context;
                        console.log('컨텍스트 만들기 끝', context);
                        next();
                    });
                },
                function(next)
                {
                    nlpManager.tokenize(language, rawText, function(result)
                    {
                        if(!result)
                            result = rawText;

                        var nlp = [];
                        for (var i=0, l=result.length; i<l; i++)
                        {
                            if(result[i].pos == 'Alpha')
                                result[i].pos = 'Noun';

                            if(result[i].text && result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation')
                                nlp.push(result[i]);
                        }

                        nlpInput = nlp.join(' ');
                        nlpInput = nlpInput.replace(/(?:\{ | \})/g, '+');

                        if(nlpInput == '')
                            nlpInput = rawText;

                        context.botUser.nlpAll = result;
                        context.botUser.nlp = nlp;

                        next();
                    },
                    function(error)
                    {
                        responseCallback({ type: 'error', message : error });
                    });
                },
                function(next)
                {
                    entity.matchDictionaryEntities(botId, context.botUser.nlp, function(_inRaw, _entities)
                    {
                        doc.entities = utils.merge(doc.entities, _entities);
                        console.log('entities: ' + JSON.stringify(_entities));
                        next();
                    });
                },
                function(next)
                {
                    // 일단 이건 생략...
                    // checkTypes(inRaw, commonTypes, {}, context, function(_inRaw, _entities)
                    // {
                    //     //_inRaw 는 {typeName}, _entities는 {typeName: matched Value}
                    //     //여기서는 mobile과 date만 체크함. why commonTypes에 두개만 추가되어있음
                    //     // 만약 inRaw(사용자입력)에 010-6258-8718 입니다. 날짜는 7월 21일 입니다. 가 입력되면
                    //     // _inRaw : {mobileType} 입니다. 날짜는 {dateType} 입니다.
                    //     // _entities: { mobileType: '010-6258-8718', dateType: '7월 21일' } 이 된다.
                    //     doc.entities = utils.merge(doc.entities, _entities);
                    //     context.botUser.entities = doc.entities;
                    //     cb(null);
                    // });

                    next();
                },
                function(next)
                {
                    // if(context.bot.intentOption == undefined || context.bot.intentOption.useIntent)
                    // {
                    //     intent.matchIntent(rawText, nlpInput, context, function(matched, _intent, _dialog)
                    //     {
                    //         if(_intent)
                    //         {
                    //             doc.intent = _intent;
                    //             context.botUser.intent = _intent;
                    //         }
                    //         else
                    //         {
                    //             doc.intent = undefined;
                    //             context.botUser.intent = undefined;
                    //         }
                    //
                    //         if(_dialog)
                    //         {
                    //             doc.intentDialog = _dialog;
                    //             context.botUser.intentDialog = _dialog;
                    //         }
                    //         else
                    //         {
                    //             doc.intentDialog = undefined;
                    //             context.botUser.intentDialog = undefined;
                    //         }
                    //
                    //         console.log('intent: ' + JSON.stringify(_intent));
                    //         cb(null);
                    //     });
                    // }
                    // else
                    // {
                    //     cb(null);
                    // }

                    next();
                },
                function(next)
                {
                    // var dialogModule = require(path.resolve('./bot-engine/action/common/dialog'));
                    // var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));
                    //
                    // dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType, {}, context, function(inNLP, task, matched)
                    // {
                    //     if(matched) context.botUser.userDialogs = task.typeDoc;
                    //     else context.botUser.userDialogs = undefined;
                    //     cb(null);
                    // });

                    next();
                },
                function(next)
                {
                    // var dialogModule = require(path.resolve('./bot-engine/action/common/dialog'));
                    // var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));
                    //
                    // dialogModule.executeType(inRaw, inNLP, globalDialogs.dialogsType, {}, context, function(inNLP, task, matched)
                    // {
                    //     if(matched) context.botUser.dialogsetDialogs = task.typeDoc;
                    //     else context.botUser.dialogsetDialogs = undefined;
                    //     cb(null);
                    // });

                    next();
                },

                function(next)
                {
                    var bestDialog;

                    if(context.botUser.intentDialog)
                    {
                        bestDialog = context.botUser.intentDialog;
                    }

                    if(context.botUser.userDialogs)
                    {
                        var userDialog = context.botUser.userDialogs[0];
                        if(!bestDialog || userDialog.matchRate > bestDialog.matchRate || userDialog.matchCount > bestDialog.matchCount)
                        {
                            bestDialog = userDialog;
                        }
                    }

                    if(context.botUser.dialogsetDialogs)
                    {
                        var dialogsetDialog = context.botUser.dialogsetDialogs[0];
                        if(!bestDialog || dialogsetDialog.matchRate > bestDialog.matchRate || dialogsetDialog.matchCount > bestDialog.matchCount)
                        {
                            bestDialog = dialogsetDialog;
                        }
                    }

                    if(bestDialog)
                    {
                        context.botUser.bestDialog = bestDialog;
                    }

                    next();
                }
            ], function()
            {
                context.botUser.nlpCorrection = undefined;
                context.botUser.inRawCorrection = undefined;
                context.botUser.wordCorrection = undefined;

                responseCallback(nlpInput, doc);
            });
        }
    };


    module.exports = new Core();
})();
