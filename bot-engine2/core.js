require('./utils/model-loader.js');

var path = require('path');
var async = require('async');
var logger = require(path.resolve('./config/lib/logger.js'));

var mongoose = require('./utils/mongo-wrapper.js');

var AsyncProcess = require('./utils/async-process/core.js');
var contextManager = require('./context-manager.js');
var commandManager = require('./command-manager.js');
var nlpManager = require('./nlp-manager.js');
var matchManager = require('./match-manager.js');
var responseManager = require('./response-manager.js');

var socketReceiver = require('./receiver/socket-receiver.js');

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

    Core.prototype.nlp = function(language, rawText, done, errorCallback)
    {
        nlpManager.tokenize(language, rawText, function(result)
        {
            var processed = result.processed;

            if(!processed)
                processed = rawText;

            var nlp = [];
            var nlpTextList = [];
            for (var i=0, l=processed.length; i<l; i++)
            {
                if(processed[i].pos == 'Alpha')
                    processed[i].pos = 'Noun';

                if(processed[i].text && processed[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && processed[i].pos !== 'Punctuation')
                {
                    nlpTextList.push(processed[i].text);
                    nlp.push(processed[i]);
                }
            }

            var nlpText = nlpTextList.join(' ');
            nlpText = nlpText.replace(/(?:\{ | \})/g, '+');

            if(nlpText == '')
                nlpText = rawText;

            done(nlp, nlpText);
        },
        function(error)
        {
            errorCallback({ type: 'error', message : error });
        });
    };

    Core.prototype.loadDialogs = function(botId, userId, done)
    {
        var Dialogset = mongoose.model('Dialogset');
        var DialogsetDialog = mongoose.model('DialogsetDialog');

        Dialogset.find({ bot: botId, user: userId }).lean().exec(function(err, dialogsets)
        {
            var result = [];

            if(err)
            {
                logger.systemError(err);
                done(result);
            }
            else
            {
                async.each(dialogsets, function(dialogset, done)
                {
                    DialogsetDialog.find({ dialogset: dialogset._id }).lean().exec(function(err, dialogs)
                    {
                        if(err)
                        {
                            logger.systemError(err);
                        }
                        else
                        {
                            if(dialogs)
                            {
                                for(var i=0; i<dialogs.length; i++)
                                {
                                    result.push(JSON.parse(JSON.stringify(dialogs[i])));
                                }
                            }
                        }

                        done();
                    });
                }, function()
                {
                    done(result);
                });
            }
        });
    };

    Core.prototype.process = function(requestData, responseCallback)
    {
        var language = requestData.language;
        var botId = requestData.botId;
        var userId = requestData.userId;
        var channel = requestData.channel || 'socket';
        var options = requestData.options || {};
        var rawText = requestData.rawText;

        // 1. 컨텍스트
        // 2. 사용자 입력 분석
        //   2-1. 자연어처리
        //   2-2. 공통타입패턴 추출
        //   2-3. 엔티티 분석
        //   2-4. 인텐트 분석

        // 1. 컨텍스트 생성.
        // 2. 자연어처리
        // 3. 엔티티 딕셔너리
        // 4. 공통 타입체크 (모바일, 주소)
        // - typeExtracter.extract(commonTypes, rawText, function(replacedText, extracted){});
        // 5. 인텐트 처리
        // 6. dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType
        // 7. dialogModule.executeType(inRaw, inNLP, globalDialogs.dialogsType
        // 8. 베스트 다이얼로그 선택
        // 9. 지식그래프 학습 (optional)
        // 10. 커맨드 처리
        // 11. bot.dialogs 매치 체크

        if(rawText.startsWith(':'))
        {
            commandManager.execute(rawText, {}, function(process)
            {
                if(process.type == 'response')
                {
                    responseCallback(process.data);
                }
            });
        }
        else
        {
            this.nlp(language, rawText, function(nlp, nlpText)
            {
                logger.systemLog('-- 자연어처리');
                logger.systemLog('nlp :', JSON.stringify(nlp));
                logger.systemLog('nlpText : ', nlpText);
                this.loadDialogs(botId, userId, function(dialogs)
                {
                    logger.systemLog('-- 다이얼로그 목록 : ', JSON.stringify(dialogs));
                    var dialog = matchManager.match(nlpText, dialogs);
                    if(dialog)
                    {
                        logger.systemLog('-- 매치 결과 : ', JSON.stringify(dialog));
                        responseManager.returnResponse(dialog, responseCallback);
                    }
                    else
                    {
                        responseCallback('무슨말이야?');
                    }
                });
            }.bind(this), responseCallback);

            // var doc = { entities: {} };
            // var context = undefined;
            // var nlpInput = '';
            //
            // async.waterfall([
            //     function(next)
            //     {
            //         contextManager.makeContext(botId, userId, channel, options, function(_context)
            //         {
            //             context = _context;
            //             console.log('컨텍스트 만들기 끝', context);
            //             next();
            //         });
            //     },
            //     function(next)
            //     {
            //         nlpManager.tokenize(language, rawText, function(result)
            //         {
            //             if(!result)
            //                 result = rawText;
            //
            //             var nlp = [];
            //             for (var i=0, l=result.length; i<l; i++)
            //             {
            //                 if(result[i].pos == 'Alpha')
            //                     result[i].pos = 'Noun';
            //
            //                 if(result[i].text && result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation')
            //                     nlp.push(result[i]);
            //             }
            //
            //             nlpInput = nlp.join(' ');
            //             nlpInput = nlpInput.replace(/(?:\{ | \})/g, '+');
            //
            //             if(nlpInput == '')
            //                 nlpInput = rawText;
            //
            //             context.botUser.nlpAll = result;
            //             context.botUser.nlp = nlp;
            //
            //             next();
            //         },
            //         function(error)
            //         {
            //             responseCallback({ type: 'error', message : error });
            //         });
            //     },
            //     function(next)
            //     {
            //         entity.matchDictionaryEntities(botId, context.botUser.nlp, function(_inRaw, _entities)
            //         {
            //             doc.entities = utils.merge(doc.entities, _entities);
            //             console.log('entities: ' + JSON.stringify(_entities));
            //             next();
            //         });
            //     },
            //     function(next)
            //     {
            //         // 일단 이건 생략...
            //         // checkTypes(inRaw, commonTypes, {}, context, function(_inRaw, _entities)
            //         // {
            //         //     //_inRaw 는 {typeName}, _entities는 {typeName: matched Value}
            //         //     //여기서는 mobile과 date만 체크함. why commonTypes에 두개만 추가되어있음
            //         //     // 만약 inRaw(사용자입력)에 010-6258-8718 입니다. 날짜는 7월 21일 입니다. 가 입력되면
            //         //     // _inRaw : {mobileType} 입니다. 날짜는 {dateType} 입니다.
            //         //     // _entities: { mobileType: '010-6258-8718', dateType: '7월 21일' } 이 된다.
            //         //     doc.entities = utils.merge(doc.entities, _entities);
            //         //     context.botUser.entities = doc.entities;
            //         //     cb(null);
            //         // });
            //
            //         next();
            //     },
            //     function(next)
            //     {
            //         // if(context.bot.intentOption == undefined || context.bot.intentOption.useIntent)
            //         // {
            //         //     intent.matchIntent(rawText, nlpInput, context, function(matched, _intent, _dialog)
            //         //     {
            //         //         if(_intent)
            //         //         {
            //         //             doc.intent = _intent;
            //         //             context.botUser.intent = _intent;
            //         //         }
            //         //         else
            //         //         {
            //         //             doc.intent = undefined;
            //         //             context.botUser.intent = undefined;
            //         //         }
            //         //
            //         //         if(_dialog)
            //         //         {
            //         //             doc.intentDialog = _dialog;
            //         //             context.botUser.intentDialog = _dialog;
            //         //         }
            //         //         else
            //         //         {
            //         //             doc.intentDialog = undefined;
            //         //             context.botUser.intentDialog = undefined;
            //         //         }
            //         //
            //         //         console.log('intent: ' + JSON.stringify(_intent));
            //         //         cb(null);
            //         //     });
            //         // }
            //         // else
            //         // {
            //         //     cb(null);
            //         // }
            //
            //         next();
            //     },
            //     function(next)
            //     {
            //         // var dialogModule = require(path.resolve('./bot-engine/action/common/dialog'));
            //         // var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));
            //         //
            //         // dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType, {}, context, function(inNLP, task, matched)
            //         // {
            //         //     if(matched) context.botUser.userDialogs = task.typeDoc;
            //         //     else context.botUser.userDialogs = undefined;
            //         //     cb(null);
            //         // });
            //
            //         next();
            //     },
            //     function(next)
            //     {
            //         // var dialogModule = require(path.resolve('./bot-engine/action/common/dialog'));
            //         // var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));
            //         //
            //         // dialogModule.executeType(inRaw, inNLP, globalDialogs.dialogsType, {}, context, function(inNLP, task, matched)
            //         // {
            //         //     if(matched) context.botUser.dialogsetDialogs = task.typeDoc;
            //         //     else context.botUser.dialogsetDialogs = undefined;
            //         //     cb(null);
            //         // });
            //
            //         next();
            //     },
            //
            //     function(next)
            //     {
            //         var bestDialog;
            //
            //         if(context.botUser.intentDialog)
            //         {
            //             bestDialog = context.botUser.intentDialog;
            //         }
            //
            //         if(context.botUser.userDialogs)
            //         {
            //             var userDialog = context.botUser.userDialogs[0];
            //             if(!bestDialog || userDialog.matchRate > bestDialog.matchRate || userDialog.matchCount > bestDialog.matchCount)
            //             {
            //                 bestDialog = userDialog;
            //             }
            //         }
            //
            //         if(context.botUser.dialogsetDialogs)
            //         {
            //             var dialogsetDialog = context.botUser.dialogsetDialogs[0];
            //             if(!bestDialog || dialogsetDialog.matchRate > bestDialog.matchRate || dialogsetDialog.matchCount > bestDialog.matchCount)
            //             {
            //                 bestDialog = dialogsetDialog;
            //             }
            //         }
            //
            //         if(bestDialog)
            //         {
            //             context.botUser.bestDialog = bestDialog;
            //         }
            //
            //         next();
            //     }
            // ], function()
            // {
            //     context.botUser.nlpCorrection = undefined;
            //     context.botUser.inRawCorrection = undefined;
            //     context.botUser.wordCorrection = undefined;
            //
            //     responseCallback(nlpInput, doc);
            // });
        }
    };


    module.exports = new Core();
})();
