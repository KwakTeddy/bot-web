var chalk = require('chalk');

var Transaction = require('./utils/transaction.js');

var utils = require('./utils/utils.js');

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

    AnswerManager.prototype.answer = function(bot, context, dialog, error, callback)
    {
        var inputRaw = dialog.input.text;
        var nlp = dialog.input.nlp;

        var transaction = new Transaction.async();
        transaction.dialog = dialog;

        QNAManager.find(bot, inputRaw, nlp, transaction.callback(function(err, matchedList, done)
        {
            if(matchedList.length > 0)
            {
                transaction.qa = { type: 'qa', dialog: matchedList[0] };
            }

            done();
        }));

        DialogGraphManager.find(bot, context, dialog, transaction.callback(function(err, foundDialog, done)
        {
            if(foundDialog)
            {
                transaction.dm = { type: 'dm', dialog: foundDialog };
            }

            done();
        }));

        transaction.done(function()
        {
            var dialog = this.dialog;

            if(this.dm)
            {
                for(var key in this.dm.dialog)
                {
                    if(key == 'input')
                    {
                        dialog.originalInput = this.dm.dialog.input;
                    }
                    else if(key == 'output')
                    {
                        dialog.originalOutput = this.dm.dialog.output;
                    }
                    else
                    {
                        dialog[key] = this.dm.dialog[key];
                    }
                }

                DialogGraphManager.exec(bot, context, dialog, function(output)
                {
                    var currentDialogId = bot.dialogMap[context.session.currentDialogId];
                    var previousDialogId = undefined;
                    if(context.session.previousDialogId)
                    {
                        previousDialogId = bot.dialogMap[context.session.previousDialogId];
                    }
                    else
                    {
                        previousDialogId = {};
                    }

                    if(output)
                    {
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialogId.input.text, currentDialogId.input.nlpText, output.text, currentDialogId.id, currentDialogId.name, previousDialogId.id, previousDialogId.name, false, 'dialog');

                        callback({ type: 'dialog', dialogId: context.session.dialogCursor, output: output });
                    }
                    else if(this.qa)
                    {
                        var text = this.qa.dialog.output[utils.getRandomInt(0, this.qa.dialog.output.length-1)];

                        console.log();
                        console.log(chalk.yellow('[[[ Q&A ]]]'));
                        console.log(this.qa.dialog);
                        console.log(text);

                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialogId.input.text, currentDialogId.input.nlpText, text, '', '', '', '', false, 'qna');

                        callback({ type: 'qa', text: text });
                    }
                    else
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ No Answer ]]]'));

                        var dialog = bot.dialogMap['noanswer'];
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, currentDialogId.input.text, currentDialogId.input.nlpText, currentDialogId.output[0].text, currentDialogId.id, currentDialogId.name, previousDialogId.id, previousDialogId.name, true, 'dialog');
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
