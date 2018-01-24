var QA = require('./answer/qa.js');
var DialogGraphManager = require('./answer/dm.js');

(function()
{
    var AnswerManager = function()
    {

    };

    AnswerManager.prototype.analysis = function(bot, session, context, error, callback)
    {
        var nlp = context.nlu.nlp;
        var intents = context.nlu.intents;
        var entities = context.nlu.entities;

        QA.find(bot, nlp, function(err, matchedList)
        {
            console.log('큐에이 결과 : ', matchedList);
            DialogGraphManager.find(bot, nlp, function()
            {
                callback();
            });
        });
    };

    module.exports = new AnswerManager();
})();
