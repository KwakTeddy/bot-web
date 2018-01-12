var NLPManager = require('./input/nlp.js');
// var EntityManager = require('./input/entity.js');

(function()
{
    var InputManager = function()
    {

    };

    InputManager.prototype.process = function(bot, session, context, error, callback)
    {
        var inputRaw = context.nlu.sentence;

        console.log();
        console.log('----- Input Process [Start]');
        console.log('inputRaw : ', inputRaw);

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");

        NLPManager.analysis(bot.language, inputRaw, function(err, lastChar, inNLP, nlp, nlpAll, sentenceInfo, turnTaking, nlpJsonPOS)
        {
            if(err)
            {
                return error.delegate(err);
            }

            context.nlu.nlp = nlp;
            context.nlu.json = nlpJsonPOS;
            context.nlu.sentenceInfo = sentenceInfo;
            context.nlu.turnTaking = turnTaking;
            context.nlu.inNLP = inNLP;
            context.nlu.nlpAll = nlpAll;
            context.nlu.nlp = nlp;
            context.nlu.lastChar = lastChar;

            console.log('context : ', context);

            console.log('----- Input Process [End]');

            callback('넵');
        });
    };

    module.exports = new InputManager();
})();
