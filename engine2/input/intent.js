var mongoose = require('mongoose');

var IntentContent = mongoose.model('IntentContent');

(function()
{
    var IntentManager = function()
    {
        this.limit = 10;
    };

    IntentManager.prototype.analysis = function(bot, nlp, callback)
    {
        var idList = [];
        for(var i=0; i<bot.intents.length; i++)
        {
            idList.push(bot.intents[i]._id);
        }

        IntentContent.find({ intentId: { $in: idList } }).populate('intentId').limit(this.limit).lean().exec(function(err, list)
        {
            if(err)
            {
                return callback(err);
            }

            var result = {};
            for(var i=0; i<nlp.length; i++)
            {
                if(nlp[i].pos == 'Josa' || nlp[i].pos == 'Suffix')
                {
                    continue;
                }

                var word = RegExp.escape(nlp[i].text);

                for(var j=0; j<list.length; j++)
                {
                    if(list[j].input.indexOf(word) != -1)
                    {
                        if(!result[list[j].intentId._id])
                        {
                            result[list[j].intentId._id] = { intentId: list[j].intentId._id, intentName: list[j].intentId.name, matchCount: 0 };
                        }

                        result[list[j].intentId._id].matchCount += (nlp[i].pos == 'Noun' ? 2 : 1);
                    }
                }
            }

            var matched = [];
            for(var key in result)
            {
                result[key].matchRate = (nlp.length == result[key].matchCount);
                matched.push(result[key]);
            }

            matched.sort(function(a, b)
            {
                return b.matchCount - a.matchCount;
            });

            callback(null, matched);
        });
    };

    module.exports = new IntentManager();
})();
