var chalk = require('chalk');

var Transaction = require('./utils/transaction.js');

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
        var inputRaw = userInput.text;
        var nlp = userInput.nlp;

        var transaction = new Transaction.async();
        QNAManager.find(bot, inputRaw, nlp, transaction.callback(function(err, matchedList, done)
        {
            if(matchedList.length > 0)
            {
                transaction.qa = { type: 'qa', foundDialog: matchedList[0] };
            }

            done();
        }));

        DialogGraphManager.find(bot, context, userInput, transaction.callback(function(err, foundDialog, done)
        {
            if(foundDialog)
            {
                transaction.dm = { type: 'dm', foundDialog: foundDialog };
            }

            done();
        }));

        transaction.done(function()
        {
            if(this.dm)
            {
                var cloneDialog = ContextManager.createDialog(this.dm.foundDialog, userInput);
                DialogGraphManager.execWithRecord(bot, context, cloneDialog, function(output)
                {
                    // cloneDialog.output = output;
                    output = OutputManager.make(context, cloneDialog, output);

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
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.input.text, currentDialog.input.nlpText, output.text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, false, 'dialog');

                        callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
                    }
                    else if(this.qa)
                    {
                        var text = this.qa.dialog.output[utils.getRandomInt(0, this.qa.dialog.output.length-1)];

                        console.log();
                        console.log(chalk.yellow('[[[ Q&A ]]]'));
                        console.log(this.qa.dialog);
                        console.log(text);

                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.input.text, currentDialog.input.nlpText, text, '', '', '', '', false, 'qna');

                        callback({ type: 'qa', text: text });
                    }
                    else
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ No Answer ]]]'));

                        var dialog = bot.dialogMap['noanswer'];
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialog.input.text, currentDialog.input.nlpText, currentDialog.output[0].text, currentDialog.id, currentDialog.name, previousDialog.id, previousDialog.name, true, 'dialog');
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
    };

    module.exports = new AnswerManager();
})();
