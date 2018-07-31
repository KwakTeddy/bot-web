var chalk = require('chalk');
var async = require('async');

var Transaction = require('./utils/transaction.js');

var Globals = require('./globals.js');

var Logger = require('./logger.js');

var utils = require('./utils/utils.js');

var AutoCorrection = require('./input/nlp/autoCorrection.js');

var ContextManager = require('./context.js');
var OutputManager = require('./output.js');
var QNAManager = require('./answer/qa.js');
var DialogGraphManager = require('./answer/dm.js');
var QuibbleManager = require('./answer/quibble.js');

var Logger = require('./logger.js');

(function()
{
    // 어떤 답변을 할 것인지 선택해주는 역할.
    // 딱 선택까지만 한다.
    var AnswerManager = function()
    {
    };

    AnswerManager.prototype.noAnswer = function(transaction, bot, context, userInput, previousDialog, error, callback)
    {
        var quibble = undefined;
        if(bot.options.useQuibble)
        {
            quibble = QuibbleManager.process(bot.quibbles, userInput);
        }

        if(quibble)
        {
            console.log();
            console.log(chalk.yellow('[[[ Quibble ]]]'));

            Logger.analysisLog('answer', { output: { text : quibble } }, context.user.userKey);
            Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, userInput.text, userInput.nlpText, quibble, 'quibble', 'quibble', previousDialog.card.id, previousDialog.card.name, true, 'dialog');
            callback({ type: 'dialog', dialogId: '', output: { text: quibble } });
        }
        else
        {
            if(bot.options.useAutoCorrection)
            {
                var fixed = AutoCorrection.correction(userInput.text);

                if(fixed != userInput.text)
                {
                    userInput.text = fixed;
                    return this.answer(bot, context, userInput, error, callback);
                }
            }

            console.log();
            console.log(chalk.yellow('[[[ No Answer ]]]'));

            var target = undefined;
            if(transaction.qa && transaction.qa.matchedDialog)
            {
                target = transaction.qa.matchedDialog;
                target.requiredMatchRate = bot.options.dialogsetMinMatchRate;
            }

            var dialog = bot.dialogMap['noanswer'];
            var output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
            Logger.analysisLog('answer', { target: target, output: { text : output } }, context.user.userKey);
            Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, userInput.text, userInput.nlpText, output.text, dialog.id, dialog.name, previousDialog.card.id, previousDialog.card.name, true, 'dialog');
            callback({ type: 'dialog', dialogId: context.session.dialogCursor, originalDialogId: dialog.id, output: output });
        }
    };

    AnswerManager.prototype.paging = function(transaction, bot, context, userInput, error, callback)
    {
        var that = this;
        var dialogId = context.session.dialogCursor;
        var target = bot.dialogMap[dialogId];

        if(userInput.text == '<')
        {
            if(context.session.page-1 < 1)
            {
                return callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: { text: '첫 페이지 입니다.\n다음페이지를 보시려면 > 를 입력해주세요.' } });
            }
            else
            {
                context.session.page--;
            }
        }
        else if(userInput.text == '>')
        {
            if(context.session.page+1 > context.session.totalPage)
            {
                return callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: { text: '마지막 페이지 입니다.\n이전페이지를 보시려면 < 를 입력해주세요.' } });
            }
            else
            {
                context.session.page++;
            }
        }

        var tempDialogInstance = ContextManager.createDialogInstance(target, userInput);
        DialogGraphManager.exec(bot, context, tempDialogInstance, function(output, dialogInstance)
        {
            var previousDialog = undefined;
            if(context.session.history.length > 1)
            {
                previousDialog = context.session.history[1];
            }
            else
            {
                previousDialog = { card: {} };
            }

            if(output)
            {
                output = OutputManager.make(context, userInput, dialogInstance, output);

                var currentDialog = context.session.history[0];
                if(!currentDialog.userInput)
                    currentDialog.userInput = userInput;

                Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.card.id, currentDialog.card.name, previousDialog.card.id, previousDialog.card.name, false, 'dialog');

                callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
            }
            else
            {
                that.noAnswer(transaction, bot, context, userInput, previousDialog, error, callback);
            }
        });
    };

    AnswerManager.prototype.retryQuestion = function(transaction, bot, context, userInput, error, callback)
    {
        var that = this;
        // Task에서 파라미터 재질의 한 경우
        async.eachSeries(context.session.retryInput, function(typeName, next)
        {
            var type = bot.types[typeName];
            if(!type)
            {
                type = Globals.types[typeName];
            }

            if(type && type.typeCheck)
            {
                type.typeCheck.call(type, { userInput: userInput }, context, function(matched, parsed)
                {
                    if(matched)
                    {
                        if(parsed)
                        {
                            context.session.retryDialogInstance.userInput.types[type.name] = parsed;
                        }
                    }

                    next();
                });
            }
            else
            {
                //로깅
                next();
            }
        },
        function()
        {
            DialogGraphManager.exec(bot, context, context.session.retryDialogInstance, function(output, dialogInstance)
            {
                var previousDialog = undefined;
                if(context.session.history.length >= 1)
                {
                    previousDialog = context.session.history[0];
                }
                else
                {
                    previousDialog = { card: {} };
                }

                if(output)
                {
                    output = OutputManager.make(context, userInput, dialogInstance, output);

                    var currentDialog = context.session.history[0];
                    if(!currentDialog.userInput)
                        currentDialog.userInput = userInput;

                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.card.id, currentDialog.card.name, previousDialog.card.id, previousDialog.card.name, false, 'dialog');

                    callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
                }
                else
                {
                    that.noAnswer(transaction, bot, context, userInput, previousDialog, error, callback);
                }
            });
        });
    };

    AnswerManager.prototype.qna = function(transaction, bot, context, userInput, callback)
    {
        var text = transaction.qa.matchedDialog.output[utils.getRandomInt(0, transaction.qa.matchedDialog.output.length-1)];

        if(transaction.qa.matchedDialog.category)
        {
            context.session.currentCategory = transaction.qa.matchedDialog.category;
        }

        console.log();
        console.log(chalk.yellow('[[[ Q&A ]]]'));
        console.log(transaction.qa.matchedDialog);
        console.log(text);

        Logger.analysisLog('answer', { target: transaction.qa.matchedDialog, output: { text : text } }, context.user.userKey);
        Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, userInput.text, userInput.nlpText, text, transaction.qa.matchedDialog._id, transaction.qa.matchedDialog.inputRaw[0], '', '', false, 'qna');

        var output = OutputManager.make(context, userInput, {}, { text: text });
        callback({ type: 'qa', output: output });
    };

    AnswerManager.prototype.dm = function(transaction, bot, context, userInput, error, callback)
    {
        var that = this;
        var dialogInstance = ContextManager.createDialogInstance(transaction.dm.matchedDialog, userInput);
        DialogGraphManager.execWithRecord(bot, context, dialogInstance, function(output, d)
        {
            if(d)
            {
                dialogInstance = d;
            }
            // cloneDialog.output = output;

            var previousDialog = undefined;
            if(context.session.history.length > 1)
            {
                previousDialog = context.session.history[1];
            }
            else
            {
                previousDialog = { card: {} };
            }

            if(output)
            {
                output = OutputManager.make(context, userInput, dialogInstance, output);

                var currentDialog = context.session.history[0];
                if(!currentDialog.userInput)
                    currentDialog.userInput = userInput;

                Logger.analysisLog('answer', { target: dialogInstance, output: output }, context.user.userKey);
                Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.card.id, currentDialog.card.name, previousDialog.card.id, previousDialog.card.name, false, 'dialog');

                callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
            }
            else
            {
                that.noAnswer(transaction, bot, context, userInput, previousDialog, error, callback);
            }
        });
    };

    AnswerManager.prototype.answer = function(bot, context, userInput, error, callback)
    {
        if(bot.options.isHuman)
        {
            // 사용자가 봇과 대화하다가 사람이 가로채서 대화하는 경우 여기로 들어옴.
            if(Logger.userSockets[context.user.userKey])
            {
                // 어떻게 로깅을 하지
                Logger.userSockets[context.user.userKey].emit('chat_log', { type: 'dialog', inputRaw: userInput.text });
                // Logger.logUserDialog(bot.id, context.user.userKey, context.channel.name, userInput.text, userInput.nlpText, '', '', '', previousDialog.card.id, previousDialog.card.name, true, 'dialog');
            }

            return;
        }

        var transaction = new Transaction.sync();

        var that = this;
        var text = userInput.text;
        if((text == '>' || text == '<') && context.session.isPaging)
        {
            // 챗봇 결과가 많을 경우 페이징 처리
            return this.paging(transaction, bot, context, userInput, error, callback);
        }
        else
        {
            context.session.page = undefined;
            context.session.totalPage = undefined;
            context.session.isPaging = undefined;
        }

        if(context.session.retryDialogInstance && context.session.retryInput)
        {
            //task에서 재질의 한경우
            this.retryQuestion(transaction, bot, context, userInput, error, callback);
        }
        else
        {
            var inputRaw = userInput.text;
            var nlp = userInput.nlp;
            var nlpText = userInput.nlpText;
            var synonyms = userInput.synonyms;

            transaction.call(function(done)
            {
                //대화셋해서 사용자 입력과 비슷한 답변을 찾음
                QNAManager.find(bot, context, inputRaw, synonyms, nlp, nlpText, function(err, matchedList)
                {
                    if(matchedList.length > 0)
                    {
                        //만약 matchRate가 똑같은게 여러개 있다면 물어봐야함.
                        context.demo = { qa: matchedList  };
                        transaction.qa = { type: 'qa', matchedDialog: matchedList[0] };
                    }

                    done();
                });
            });

            transaction.call(function(done)
            {
                if(!context.session.findOnlyQA)
                {
                    // 대화 시나리오에서 history 기반으로 답변을 검색
                    DialogGraphManager.find(bot, context, userInput, function(err, matchedDialog)
                    {
                        if(matchedDialog)
                        {
                            transaction.dm = { type: 'dm', matchedDialog: matchedDialog };
                        }

                        done();
                    });
                }
                else
                {
                    done();
                }
            });

            transaction.done(function()
            {
                Logger.analysisLog('input', userInput, context.user.userKey);

                context.session.currentCategory = '';

                if(bot.options.hybrid.use)
                {
                    //하이브리드 옵션이 사용중이면 대화셋과 시나리오의 답변중 더 정확한걸로 보여줌
                    var qaMatchedRate = transaction.qa && transaction.qa.matchedDialog ? transaction.qa.matchedDialog.matchRate : -1;
                    var dmMatchedRate = transaction.dm && transaction.dm.matchedDialog ? transaction.dm.matchedDialog.matchRate : -1;

                    if(((qaMatchedRate > dmMatchedRate) || (qaMatchedRate && !dmMatchedRate)) && qaMatchedRate >= (bot.options.dialogsetMinMatchRate || 0.5))
                    {
                        return that.qna(transaction, bot, context, userInput, callback);
                    }
                }

                if(transaction.dm && transaction.dm.matchedDialog)
                {
                    that.dm(transaction, bot, context, userInput, error, callback);
                }
                else if(!bot.options.hybrid.use && transaction.qa && transaction.qa.matchedDialog && transaction.qa.matchedDialog.matchRate >= (bot.options.dialogsetMinMatchRate || 0.5))
                {
                    that.qna(transaction, bot, context, userInput, callback);
                }
                else
                {
                    var previousDialog = undefined;
                    if(context.session.history.length >= 1)
                    {
                        previousDialog = context.session.history[0];
                    }
                    else
                    {
                        previousDialog = { card: {} };
                    }

                    that.noAnswer(transaction, bot, context, userInput, previousDialog, error, callback);
                }
            });
        }
    };

    module.exports = new AnswerManager();
})();
