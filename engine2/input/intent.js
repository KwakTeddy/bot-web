var mongoose = require('mongoose');

var Transaction = require('../utils/transaction.js');

var IntentContent = mongoose.model('IntentContent');

(function()
{
    var IntentManager = function()
    {
    };

    IntentManager.prototype.analysis = function(bot, context, inputRaw, nlp, nlpText, callback)
    {
        var idList = [];
        for(var i=0; i<bot.intents.length; i++)
        {
            idList.push(bot.intents[i]._id);
        }

        var transaction = new Transaction.sync();
        transaction.call(function(done)
        {
            IntentContent.find({ intentId: { $in: idList }, name: inputRaw }).populate('intentId').lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }

                if(list && list.length > 0)
                {
                    callback(null, list);
                }
                else
                {
                    done();
                }
            });
        });

        transaction.done(function()
        {
            var nlpCount = 0;
            var nlpList = [];
            for(var i=0; i<nlp.length; i++)
            {
                if(nlp[i].pos == 'Josa' || nlp[i].pos == 'Suffix')
                {
                    continue;
                }

                if(nlp[i].pos == 'Noun')
                {
                    nlpCount += 3;
                }
                else if(nlp[i].pos == 'Verb')
                {
                    nlpCount += 2;
                }
                else
                {
                    nlpCount += 1;
                }

                nlpList.push(new RegExp(nlp[i].text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'));
            }

            IntentContent.find({ intentId: { $in: idList }, input: { $in: nlpList } }).populate('intentId').lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }

                var matchedList = [];
                for(var i=0; i<list.length; i++)
                {
                    var point = 0;
                    var count = 0;
                    var lastIndex = -1;
                    for(var j=0; j<nlp.length; j++)
                    {
                        if(nlp[j].pos == 'Josa' || nlp[j].pos == 'Suffix')
                        {
                            continue;
                        }

                        var index = list[i].input.indexOf(nlp[j].text);
                        if(index != -1)
                        {
                            if(nlp[j].pos == 'Noun')
                            {
                                count += 3;
                            }
                            else if(nlp[j].pos == 'Verb')
                            {
                                count += 2;
                            }
                            else
                            {
                                count += 1;
                            }

                            // if(lastIndex == -1 || lastIndex <= index)
                            // {
                            //     var offset = 100;
                            //     if(nlp[j].pos == 'Noun')
                            //     {
                            //         offset = 150;
                            //     }
                            //     else if(nlp[j].pos == 'Verb')
                            //     {
                            //         offset = 100;
                            //     }
                            //     else
                            //     {
                            //         offset = 50;
                            //     }
                            //
                            //     if(lastIndex != -1)
                            //     {
                            //         point += - ((index - lastIndex) / offset) - ((index - nlpText.indexOf(nlp[j].text)) / offset);
                            //     }
                            // }

                            lastIndex = index;
                        }
                    }

                    var matchRate = count / nlpCount;
                    list[i].matchRate = matchRate;
                    list[i].added += point;
                    if(matchRate >= (bot.options.intentMinMatchRate || 0.5))
                    {
                        matchedList.push({ intentId: list[i].intentId, intentName: list[i].intentId.name, matchRate: matchRate, added: point })
                    }
                }

                matchedList.sort(function(a, b)
                {
                    return (b.matchRate + b.added) - (a.matchRate + a.added);
                });

                callback(null, matchedList);
            });
        });
    };

    module.exports = new IntentManager();
})();
