var chalk = require('chalk');

var NLPManager = require('./input/nlp.js');
var EntityManager = require('./input/entity.js');
var IntentManager = require('./input/intent.js');

(function()
{
    var InputManager = function()
    {

    };

    InputManager.prototype.analysis = function(bot, input, error, callback)
    {
        var inputRaw = input.nlu.sentence;

        console.log();
        console.log(chalk.yellow('[[[ INPUT ]]]'));
        console.log('inputRaw : ', inputRaw);

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");

        NLPManager.analysis(bot.language, inputRaw, function(err, lastChar, nlpText, nlp, sentenceInfo, turnTaking, nlpJsonPOS)
        {
            if(err)
            {
                return error.delegate(err);
            }

            input.nlu.nlp = nlp;
            input.nlu.json = nlpJsonPOS;
            input.nlu.sentenceInfo = sentenceInfo;
            input.nlu.turnTaking = turnTaking;
            input.nlu.nlpText = nlpText;
            input.nlu.lastChar = lastChar;

            console.log('nlp: ', nlp);

            EntityManager.analysis(bot, nlp, function(err, entities)
            {
                if(err)
                {
                    return error.delegate(err);
                }

                console.log('엔티티 : ', entities);
                input.nlu.entities = entities;

                IntentManager.analysis(bot, nlp, function(err, intents)
                {
                    if(err)
                    {
                        return error.delegate(err);
                    }

                    console.log('인텐트 : ', intents);
                    input.nlu.intents = intents;

                    console.log();

                    callback();
                });
            });
        });
    };

    module.exports = new InputManager();
})();
