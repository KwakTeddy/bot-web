var chalk = require('chalk');
var async = require('async');

var Transaction = require('./utils/transaction.js');

var Globals = require('./globals.js');

var utils = require('./utils/utils.js');

var ContextManager = require('./context.js');
var OutputManager = require('./output.js');
var QNAManager = require('./answer/qa.js');
var DialogGraphManager = require('./answer/dm.js');

var Logger = require('./logger.js');

(function()
{
    // 어떤 답변을 할 것인지 선택해주는 역할.
    // 딱 선택까지만 한다.
    var AnswerManager = function()
    {

    };

    AnswerManager.prototype.answer = function(bot, context, userInput, error, callback)
    {
        if(context.session.retryDialogInstance && context.session.retryInput)
        {
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
                        console.log();
                        console.log(chalk.yellow('[[[ No Answer ]]]'));

                        var dialog = bot.dialogMap['noanswer'];
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, currentDialog.output[0].text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, true, 'dialog');
                        callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: dialog.output[0] });
                    }
                });
            });
        }
        else
        {
            var transaction = new Transaction.sync();

            var inputRaw = userInput.text;
            var nlp = userInput.nlp;

            transaction.call(function(done)
            {
                QNAManager.find(bot, context, inputRaw, nlp, function(err, matchedList)
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

                if(bot.options.hybrid)
                {
                    var qaMatchedRate = transaction.qa && transaction.qa.matchedDialog ? transaction.qa.matchedDialog.matchRate : -1;
                    var dmMatchedRate = transaction.dm && transaction.dm.matchedDialog ? transaction.dm.matchedDialog.matchRate : -1;

                    if(((qaMatchedRate > dmMatchedRate) || (qaMatchedRate && !dmMatchedRate)) && qaMatchedRate >= (bot.options.dialogsetMinMatchRate || 0.5))
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

                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, userInput.text, userInput.nlpText, text, '', '', '', '', false, 'qna');

                        return callback({ type: 'qa', text: text });
                    }
                }

                if(transaction.dm && transaction.dm.matchedDialog)
                {
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
                            Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, output.text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, false, 'dialog');

                            callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
                        }
                        else
                        {
                            console.log();
                            console.log(chalk.yellow('[[[ No Answer ]]]'));

                            var dialog = bot.dialogMap['noanswer'];
                            Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, currentDialog.output[0].text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, true, 'dialog');
                            callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: dialog.output[0] });
                        }
                    });
                }
                else if(!bot.options.hybrid && transaction.qa && transaction.qa.matchedDialog && transaction.qa.matchedDialog.matchRate >= (bot.options.dialogsetMinMatchRate || 0.5))
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

                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel, userInput.text, userInput.nlpText, text, '', '', '', '', false, 'qna');

                    callback({ type: 'qa', text: text });
                }
                else
                {
                    console.log();
                    console.log(chalk.yellow('[[[ No Answer ]]]'));

                    var currentDialog = context.session.history[0];
                    if(!currentDialog)
                    {
                        currentDialog = {};
                    }

                    var dialog = bot.dialogMap['noanswer'];
                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel, userInput.text, userInput.nlpText, dialog.output[0].text, dialog.id, dialog.name, currentDialog.id, currentDialog.name, true, 'dialog');
                    callback({ type: 'dialog', dialogId: dialog.id, output: (typeof dialog.output == 'string' ? dialog.output : dialog.output[0]) });
                }
            });
        }
    };

    module.exports = new AnswerManager();
})();
