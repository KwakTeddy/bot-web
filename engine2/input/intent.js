var mongoose = require('mongoose');
var async = require('async');

var IntentContent = mongoose.model('IntentContent');

(function()
{
    var IntentManager = function()
    {
    };

    IntentManager.prototype.analysis = function(bot, nlp, nlpText, callback)
    {
        var idList = [];
        for(var i=0; i<bot.intents.length; i++)
        {
            idList.push(bot.intents[i]._id);
        }

        var nlpList = [];
        for(var i=0; i<nlp.length; i++)
        {
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
                    var index = list[i].input.indexOf(nlp[j].text);
                    if(index != -1)
                    {
                        count += (nlp[j].pos == 'Noun' ? 2 : 1);
                        if(lastIndex == -1 || lastIndex <= index)
                        {
                            point += 100 - (index - lastIndex) - (index - nlpText.indexOf(nlp[j].text));

                            if(nlp[j].pos == 'Noun')
                            {
                                point += 50;
                            }
                        }
                    }
                }

                var matchRate = count / list[i].input.split(' ').length;
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

        // IntentContent.find({ intentId: { $in: idList } }).populate('intentId').lean().exec(function(err, list)
        // {
        //     if(err)
        //     {
        //         return callback(err);
        //     }
        //
        //     var targetInput = undefined;
        //     var maxCount = -1;
        //     var maxPoint = -1;
        //
        //     for(var i=0; i<list.length; i++)
        //     {
        //         var count = 0;
        //         var point = 0;
        //         var lastIndex = -1;
        //
        //         for(var j=0; j<nlp.length; j++)
        //         {
        //             var index = list[i].input.indexOf(nlp[j].text);
        //             if(index != -1)
        //             {
        //                 count++;
        //             }
        //
        //             if(index != -1 && (lastIndex == -1 || lastIndex <= index))
        //             {
        //                 point += 100 - (index - lastIndex);
        //
        //                 if(nlp[j].pos == 'Noun')
        //                 {
        //                     point += 50;
        //                 }
        //             }
        //         }
        //
        //         if(maxPoint == -1)
        //         {
        //             maxPoint = point;
        //         }
        //
        //         if(maxCount == -1 || maxCount < count)
        //         {
        //             maxCount = count;
        //             targetInput = list[i].input;
        //         }
        //
        //         list[i].matchRate = maxCount / targetInput.split(' ').length;
        //         list[i].added = point;
        //     }
        //
        //     list.sort(function(a, b)
        //     {
        //         return b.matchRate + b.added - a.matchRate + a.added;
        //     });
        //
        //     callback(null, list);
        // });
    };

    module.exports = new IntentManager();
})();
