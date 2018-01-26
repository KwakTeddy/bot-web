var Transaction = require('./utils/transaction.js');

var QNAManager = require('./output/qa.js');
var DialogGraphManager = require('./output/dm.js');

(function()
{
    // 어떤 답변을 할 것인지 선택해주는 역할.
    // 딱 선택까지만 한다.
    var OutputManager = function()
    {

    };

    OutputManager.prototype.determine = function(bot, session, context, error, callback)
    {
        var nlp = context.nlu.nlp;

        var transaction = new Transaction.async();

        QNAManager.find(bot, nlp, transaction.callback(function(err, matchedList, done)
        {
            if(matchedList.length > 0)
            {
                transaction.qa = { type: 'qa', list: matchedList[0].output };
            }

            done();
        }));

        DialogGraphManager.find(bot, session, context, transaction.callback(function(err, dialog, done)
        {
            if(dialog)
            {
                transaction.dm = { type: 'dm', dialog: dialog };
            }

            done();
        }));

        transaction.done(function()
        {
            if(this.qa)
            {
                //TODO 여러개일때 랜덤하게 출력 dm도 마찬가지
                callback({ type: 'qa', output: this.qa.list[0] });
            }
            else if(this.dm)
            {
                context.dialog = this.dm.dialog;
                DialogGraphManager.exec(bot, session, context, this.dm.dialog, function(context, output)
                {
                    if(output)
                    {
                        callback({ type: 'dialog', dialogId: context.dialog.id, output: output });
                    }
                    else
                    {
                        var dialog = bot.dialogMap['noanswer'];
                        callback({ type: 'dialog', dialogId: dialog.id, output: dialog.output });
                    }
                });
            }
            else
            {
                var dialog = bot.dialogMap['noanswer'];
                callback({ type: 'dialog', dialogId: dialog.id, output: dialog.output });
            }
        });
    };

    module.exports = new OutputManager();
})();
