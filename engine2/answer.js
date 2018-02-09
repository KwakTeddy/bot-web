var chalk = require('chalk');

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
        var transaction = new Transaction.async();
        if(context.session.retryDialogInstance && context.session.retryInput)
        {
            async.eachSeries(context.session.retryInput, function(typeName, next)
            {
                var type = bot.types[typeName];
                if(!type)
                {
                    type = Globals.types[typeName];
                }

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
            },
            function()
            {
                DialogGraphManager.exec(bot, context, context.session.retryDialogInstance, function(output)
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
            var inputRaw = userInput.text;
            var nlp = userInput.nlp;
            QNAManager.find(bot, inputRaw, nlp, transaction.callback(function(err, matchedList, done)
            {
                if(matchedList.length > 0)
                {
                    transaction.qa = { type: 'qa', matchedDialog: matchedList[0] };
                }

                done();
            }));

            DialogGraphManager.find(bot, context, userInput, transaction.callback(function(err, matchedDialog, done)
            {
                if(matchedDialog)
                {
                    transaction.dm = { type: 'dm', matchedDialog: matchedDialog };
                }

                done();
            }));

            transaction.done(function()
            {
                if(this.dm)
                {
                    var dialogInstance = ContextManager.createDialogInstance(this.dm.matchedDialog, userInput);
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
                        else if(this.qa)
                        {
                            var text = this.qa.dialog.output[utils.getRandomInt(0, this.qa.dialog.output.length-1)];

                            console.log();
                            console.log(chalk.yellow('[[[ Q&A ]]]'));
                            console.log(this.qa.dialog);
                            console.log(text);

                            Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.userInput.text, currentDialog.userInput.nlpText, text, '', '', '', '', false, 'qna');

                            callback({ type: 'qa', text: text });
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
                else if(this.qa)
                {
                    var text = this.qa.dialog.output[utils.getRandomInt(0, this.qa.dialog.output.length-1)];
                    console.log();
                    console.log(chalk.yellow('[[[ Q&A ]]]'));
                    console.log(this.qa.dialog);
                    console.log(text);

                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel, dialog.input.text, dialog.input.nlpText, text, '', '', '', '', false, 'qna');

                    callback({ type: 'qa', text: text });
                }
                else
                {
                    console.log();
                    console.log(chalk.yellow('[[[ No Answer ]]]'));

                    var dialog = bot.dialogMap['noanswer'];
                    Logger.logUserDialog(bot.id, context.user.userKey, context.channel, dialog.input.text, dialog.input.nlpText, dialog.output[0].text, dialog.id, dialog.name, '', '', true, 'dialog');
                    callback({ type: 'dialog', dialogId: dialog.id, output: dialog.output[0] });
                }
            });
        }
    };

    module.exports = new AnswerManager();
})();
