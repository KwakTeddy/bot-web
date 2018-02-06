var chalk = require('chalk');

var NLPManager = require('./input/nlp.js');
var EntityManager = require('./input/entity.js');
var IntentManager = require('./input/intent.js');
var autoCorrection = require('./input/nlp/autoCorrection.js');

(function()
{
    var InputManager = function()
    {

    };

    InputManager.prototype.analysis = function(bot, userInput, error, callback)
    {
        var inputRaw = userInput.text;

        console.log();
        console.log(chalk.yellow('[[[ INPUT ]]]'));
        console.log('inputRaw : ', inputRaw);

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");

        if(bot.options.useAutoCorrection)
        {
            autoCorrection.loadWordCorrections();
        }

        NLPManager.analysis(bot.language, inputRaw, function(err, lastChar, nlpText, nlp, sentenceInfo, turnTaking, nlpJsonPOS)
        {
            if(err)
            {
                return error.delegate(err);
            }

            userInput.nlp = nlp;
            userInput.json = nlpJsonPOS;
            userInput.sentence = sentenceInfo;
            userInput.turnTaking = turnTaking;
            userInput.nlpText = nlpText;
            userInput.lastChar = lastChar;

            console.log('nlp: ', nlp);

            EntityManager.analysis(bot, nlp, function(err, entities)
            {
                if(err)
                {
                    return error.delegate(err);
                }

                console.log('엔티티 : ', entities);
                userInput.entities = entities;

                IntentManager.analysis(bot, nlp, function(err, intents)
                {
                    if(err)
                    {
                        return error.delegate(err);
                    }

                    console.log('인텐트 : ', intents);
                    userInput.intents = intents;

                    callback();
                });
            });
        });
    };

    module.exports = new InputManager();
})();
