var Transaction = require('./utils/transaction.js');

var QNAManager = require('./answer/qa.js');
var DialogGraphManager = require('./answer/dm.js');

(function()
{
    // 어떤 답변을 할 것인지 선택해주는 역할.
    // 딱 선택까지만 한다.
    var AnswerManager = function()
    {

    };

    AnswerManager.prototype.analysis = function(bot, session, context, error, callback)
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
            console.log('qa 결과 : ', this.qa);
            console.log('dm 결과 : ', this.dm);

            if(this.dm)
            {
                session.dialogCursor = this.dm.dialog.id;
                callback(this.dm);
            }
            else if(this.qa)
            {
                callback(this.qa);
            }
            else
            {
                callback({ text: '모르겟어요 ㅜㅜ' });
            }
        });
    };

    module.exports = new AnswerManager();
})();
