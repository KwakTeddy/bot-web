var mongoose = require('mongoose');

var Transaction = require('../utils/transaction.js');

var IntentContent = mongoose.model('IntentContent');

var MatchedIntent = mongoose.model('MatchedIntent');

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
                    var matchedList = [];
                    for(var i=0; i<list.length; i++)
                    {
                        matchedList.push({ intentId: list[i].intentId, intentName: list[i].intentId.name, matchRate: 1, added: 0, _id: list[i]._id });
                    }

                    if(matchedList.length > 0)
                    {
                        var matchedIntent = new MatchedIntent();
                        matchedIntent.botId = context.bot.id;
                        matchedIntent.intent = matchedList[0]._id;

                        matchedIntent.save(function(err)
                        {
                            if(err)
                            {
                                return console.log(err);
                            }
                        });
                    }

                    callback(null, matchedList);
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

                nlpList.push(nlp[i].text);
            }

            IntentContent.find({ intentId: { $in: idList } }).populate('intentId').lean().exec(function(err, list)
            {
                if(err)
                {
                    return callback(err);
                }

                var matchedList = [];
                for(var i=0; i<list.length; i++)
                {
                    var check = false;
                    for(var j=0; j<nlpList.length; j++)
                    {
                        if(list[i].input.indexOf(nlpList[j]) != -1)
                        {
                            check = true;
                        }
                    }

                    if(!check)
                    {
                        break;
                    }

                    var point = 0;
                    var count = 0;
                    var normalCount = 0;
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

                            normalCount++;

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

                    var matchRate = ((count / nlpCount) + (normalCount / list[i].input.split(' ').length)) / 2;
                    list[i].matchRate = matchRate;
                    list[i].added += point;
                    if(matchRate >= (bot.options.intentMinMatchRate || 0.5))
                    {
                        matchedList.push({ intentId: list[i].intentId, intentName: list[i].intentId.name, matchRate: matchRate, added: point, _id: list[i]._id })
                    }
                }

                matchedList.sort(function(a, b)
                {
                    return (b.matchRate + b.added) - (a.matchRate + a.added);
                });

                if(matchedList.length > 0)
                {
                    var matchedIntent = new MatchedIntent();
                    matchedIntent.botId = context.bot.id;
                    matchedIntent.intent = matchedList[0]._id;

                    matchedIntent.save(function(err)
                    {
                        if(err)
                        {
                            return console.log(err);
                        }
                    });
                }

                callback(null, matchedList);
            });
        });
    };

    module.exports = new IntentManager();
})();
