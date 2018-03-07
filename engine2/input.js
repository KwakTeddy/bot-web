var chalk = require('chalk');
var async = require('async');

var Transaction = require('./utils/transaction.js');

var NLPManager = require('./input/nlp.js');
var EntityManager = require('./input/entity.js');
var IntentManager = require('./input/intent.js');
var autoCorrection = require('./input/nlp/autoCorrection.js');

var mongoose = require('mongoose');
var SynonymDictionary = mongoose.model('SynonymDictionary');

(function()
{
    var InputManager = function()
    {
        // var ss = new SynonymDictionary();
        // ss.botId = 'blank_com2best_1519546742914';
        // ss.words = ['집', '보금자리', '댁', '아파트', '주택', '판자집', '빌라', '우리집'];
        //
        // ss.save(function(err)
        // {
        //     if(!err)
        //     {
        //         console.log('ㅁㅇㄴㄹ');
        //     }
        // });
    };

    InputManager.prototype.analysis = function(bot, context, userInput, error, callback)
    {
        var inputRaw = userInput.text;

        console.log();
        console.log(chalk.yellow('[[[ INPUT ]]]'));
        console.log('inputRaw : ', inputRaw);

        inputRaw = inputRaw.replace(/^\s+|\s+$/g,"");

        var transaction = new Transaction.sync();
        if(bot.options.useAutoCorrection)
        {
            transaction.call(function(done)
            {
                autoCorrection.loadWordCorrections(done);
            });
        }

        transaction.done(function()
        {
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
                userInput.types = {};

                console.log('nlp: ', nlp);

                EntityManager.analysis(bot, nlp, function(err, entities)
                {
                    if(err)
                    {
                        return error.delegate(err);
                    }

                    console.log('엔티티 : ', entities);
                    userInput.entities = entities;

                    IntentManager.analysis(bot, context, inputRaw, nlp, nlpText, function(err, intents)
                    {
                        if(err)
                        {
                            return error.delegate(err);
                        }

                        console.log('인텐트 : ', intents);
                        userInput.intents = intents;

                        userInput.synonyms = [];
                        var split = inputRaw.split(' ');
                        async.eachSeries(split, function(word, next)
                        {
                            SynonymDictionary.find({ botId: bot.id, words: { $in: [word] } }).exec(function(err, synonyms)
                            {
                                if(err)
                                {
                                    return error.delegate(err);
                                }

                                if(synonyms && synonyms.length > 0)
                                {
                                    var obj = { word: word, synonyms: [] };
                                    for(var i=0; i<synonyms.length; i++)
                                    {
                                        obj.synonyms = obj.synonyms.concat(synonyms[i].words);
                                    }

                                    userInput.synonyms.push(obj);
                                }

                                next();
                            });
                        },
                        function()
                        {
                            callback();
                        });
                    });
                });
            });
        });
    };

    module.exports = new InputManager();
})();
