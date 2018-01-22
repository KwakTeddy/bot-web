var NLPManager = require('./input/nlp.js');
var EntityManager = require('./input/entity.js');
var IntentManager = require('./input/intent.js');

(function()
{
    var InputManager = function()
    {

    };

    InputManager.prototype.analysis = function(bot, session, context, error, callback)
    {
        var inputRaw = context.nlu.sentence;

        console.log();
        console.log('----- Input Process [Start]');
        console.log('inputRaw : ', inputRaw);

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");

        NLPManager.analysis(bot.language, inputRaw, function(err, lastChar, nlpText, nlp, sentenceInfo, turnTaking, nlpJsonPOS)
        {
            if(err)
            {
                return error.delegate(err);
            }

            context.nlu.nlp = nlp;
            context.nlu.json = nlpJsonPOS;
            context.nlu.sentenceInfo = sentenceInfo;
            context.nlu.turnTaking = turnTaking;
            context.nlu.nlpText = nlpText;
            context.nlu.nlp = nlp;
            context.nlu.lastChar = lastChar;

            EntityManager.analysis(bot, nlp, function(err, entities)
            {
                if(err)
                {
                    return error.delegate(err);
                }

                console.log('엔티티 : ', entities);
                context.nlu.entities = entities;

                IntentManager.analysis(bot, nlp, function(err, intents)
                {
                    if(err)
                    {
                        return error.delegate(err);
                    }

                    console.log('인텐트 : ', intents);
                    context.nlu.intents = intents;

                    console.log('----- Input Process [End]');

                    callback();
                });
            });
        });
    };

    module.exports = new InputManager();
})();
