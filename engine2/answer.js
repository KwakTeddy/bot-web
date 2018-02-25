var chalk = require('chalk');
var async = require('async');

var Transaction = require('./utils/transaction.js');

var Globals = require('./globals.js');

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

    AnswerManager.prototype.noAnswer = function(bot, context, userInput, currentDialog, previousDialog, error, callback)
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

            Logger.analysisLog('answer', { output: { text : quibble } });
            Logger.logUserDialog(bot.id, context.user.userKey, context.channel, userInput.text, userInput.nlpText, quibble, '', '', previousDialog.id, previousDialog.name, true, 'dialog');
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

            var dialog = bot.dialogMap['noanswer'];
            var output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
            Logger.analysisLog('answer', { output: { text : output } });
            Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, currentDialog.output[0].text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, true, 'dialog');
            callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
        }
    };

    AnswerManager.prototype.paging = function(bot, context, userInput, callback)
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
            output = OutputManager.make(context, dialogInstance, output);

            var currentDialog = context.session.history[0];
            var previousDialog = undefined;
            if(context.session.history.length > 1)
            {
                previousDialog = context.session.history[1];
            }
            else
            {
                previousDialog = {};
            }

            if(output)
            {
                Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, false, 'dialog');

                callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
            }
            else
            {
                that.noAnswer(bot, userInput, currentDialog, previousDialog, error, callback);
            }
        });
    };

    AnswerManager.prototype.retryQuestion = function(bot, context, userInput, callback)
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
                output = OutputManager.make(context, dialogInstance, output);

                var currentDialog = context.session.history[0];
                var previousDialog = undefined;
                if(context.session.history.length > 1)
                {
                    previousDialog = context.session.history[1];
                }
                else
                {
                    previousDialog = {};
                }

                if(output)
                {
                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, false, 'dialog');

                    callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
                }
                else
                {
                    that.noAnswer(bot, userInput, currentDialog, previousDialog, error, callback);
                }
            });
        });
    };

    AnswerManager.prototype.qna = function(bot, context, userInput, transaction, callback)
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

        Logger.analysisLog('answer', { target: transaction.qa.matchedDialog, output: { text : text } });
        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, userInput.text, userInput.nlpText, text, transaction.qa.matchedDialog._id, transaction.qa.matchedDialog.inputRaw[0], '', '', false, 'qna');

        callback({ type: 'qa', output: { text: text }});
    };

    AnswerManager.prototype.dm = function(bot, context, userInput, transaction, callback)
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
            output = OutputManager.make(context, dialogInstance, output);

            var currentDialog = context.session.history[0];
            var previousDialog = undefined;
            if(context.session.history.length > 1)
            {
                previousDialog = context.session.history[1];
            }
            else
            {
                previousDialog = {};
            }

            if(output)
            {
                Logger.analysisLog('answer', { target: dialogInstance, output: output });
                Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, false, 'dialog');

                callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
            }
            else
            {
                that.noAnswer(bot, userInput, currentDialog, previousDialog, error, callback);
            }
        });
    };

    AnswerManager.prototype.answer = function(bot, context, userInput, error, callback)
    {
        var that = this;
        var text = userInput.text;
        if((text == '>' || text == '<') && context.session.isPaging)
        {
            return this.paging(bot, context, userInput, callback);
        }
        else
        {
            context.session.page = undefined;
            context.session.totalPage = undefined;
            context.session.isPaging = undefined;
        }

        if(context.session.retryDialogInstance && context.session.retryInput)
        {
            this.retryQuestion(bot, context, userInput, callback);
        }
        else
        {
            var transaction = new Transaction.sync();

            var inputRaw = userInput.text;
            var nlp = userInput.nlp;
            var nlpText = userInput.nlpText;

            transaction.call(function(done)
            {
                QNAManager.find(bot, context, inputRaw, nlp, nlpText, function(err, matchedList)
                {
                    if(matchedList.length > 0)
                    {
                        //만약 matchRate가 똑같은게 여러개 있다면 물어봐야함.
                        transaction.qa = { type: 'qa', matchedDialog: matchedList[0] };
                    }

                    done();
                });
            });

            transaction.call(function(done)
            {
                DialogGraphManager.find(bot, context, userInput, function(err, matchedDialog)
                {
                    if(matchedDialog)
                    {
                        transaction.dm = { type: 'dm', matchedDialog: matchedDialog };
                    }

                    done();
                });
            });

            transaction.done(function()
            {
                //qa와 dm에서 골라진거 matchRate비교해야함
                console.log(transaction);

                context.session.currentCategory = '';

                if(bot.options.hybrid.use)
                {
                    var qaMatchedRate = transaction.qa && transaction.qa.matchedDialog ? transaction.qa.matchedDialog.matchRate : -1;
                    var dmMatchedRate = transaction.dm && transaction.dm.matchedDialog ? transaction.dm.matchedDialog.matchRate : -1;

                    if(((qaMatchedRate > dmMatchedRate) || (qaMatchedRate && !dmMatchedRate)) && qaMatchedRate >= (bot.options.dialogsetMinMatchRate || 0.5))
                    {
                        return that.qna(bot, context, userInput, transaction, callback);
                    }
                }

                if(transaction.dm && transaction.dm.matchedDialog)
                {
                    that.dm(bot, context, userInput, transaction, callback);
                }
                else if(!bot.options.hybrid.use && transaction.qa && transaction.qa.matchedDialog && transaction.qa.matchedDialog.matchRate >= (bot.options.dialogsetMinMatchRate || 0.5))
                {
                    that.qna(bot, context, userInput, transaction, callback);
                }
                else
                {
                    var currentDialog = context.session.history[0];
                    var previousDialog = undefined;
                    if(context.session.history.length > 1)
                    {
                        previousDialog = context.session.history[1];
                    }
                    else
                    {
                        previousDialog = {};
                    }

                    that.noAnswer(bot, context, userInput, currentDialog, previousDialog, error, callback);
                }
            });
        }
    };

    module.exports = new AnswerManager();
})();
