var Transaction = require('./utils/transaction.js');

var autoCorrection = require('./input/nlp/autoCorrection.js');

var QNAManager = require('./output/qa.js');
var DialogGraphManager = require('./output/dm.js');

var Logger = require('./logger.js');

(function()
{
    // 어떤 답변을 할 것인지 선택해주는 역할.
    // 딱 선택까지만 한다.
    var ConversationManager = function()
    {

    };

    ConversationManager.prototype.answer = function(bot, context, error, callback)
    {
        var conversation = context.history[0];
        var nlp = conversation.nlu.nlp;

        var transaction = new Transaction.async();

        if(bot.useAutoCorrection)
        {
            autoCorrection.loadWordCorrections();
        }

        QNAManager.find(bot, nlp, transaction.callback(function(err, matchedList, done)
        {
            if(matchedList.length > 0)
            {
                transaction.qa = { type: 'qa', list: matchedList[0].output };
            }

            done();
        }));

        DialogGraphManager.find(bot, context, conversation, transaction.callback(function(err, dialog, done)
        {
            if(dialog)
            {
                transaction.dm = { type: 'dm', dialog: dialog };
            }

            done();
        }));

        transaction.done(function()
        {
            if(this.dm)
            {
                conversation.dialog = this.dm.dialog;
                DialogGraphManager.exec(bot, context, conversation, function(output)
                {
                    var prev = {};
                    if(conversation.prev)
                        prev = conversation.prev;

                    if(output)
                    {
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, conversation.nlu.inputRaw, conversation.nlu.nlpText, output.text, conversation.dialog.id, conversation.dialog.name, prev.id, prev.name, false, 'dialog');

                        callback({ type: 'dialog', dialogId: context.dialogCursor, output: output });
                    }
                    else
                    {
                        Logger.logUserDialog(bot.id, context.user.userKey, context.channel, conversation.nlu.inputRaw, conversation.nlu.nlpText, output.text, conversation.dialog.id, conversation.dialog.name, prev.id, prev.name, true, 'dialog');

                        var dialog = bot.dialogMap['noanswer'];
                        callback({ type: 'dialog', dialogId: context.dialogCursor, output: dialog.output });
                    }
                });
            }
            else if(this.qa)
            {
                console.log();
                console.log('[[[ Q&A ]]]');
                console.log(this.qa.list);
                console.log();

                Logger.logUserDialog(bot.id, context.user.userKey, context.channel, conversation.nlu.inputRaw, conversation.nlu.nlpText, this.qa.list[0], '', '', '', '', false, 'qna');

                callback({ type: 'qa', output: this.qa.list[0] });
            }
            else
            {
                var dialog = bot.dialogMap['noanswer'];
                callback({ type: 'dialog', dialogId: dialog.id, output: dialog.output });
            }
        });
    };

    module.exports = new ConversationManager();
})();
