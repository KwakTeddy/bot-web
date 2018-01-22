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
        IntentContent.find({ intentId: { $in: bot.intents } }).populate('intentId').limit(this.limit).lean().exec(function(err, list)
        {
            if(err)
            {
                return callback(err);
            }

            var checkIntentDupliacte = {};
            var matched = [];
            for(var i=0; i<nlp.length; i++)
            {
                if(nlp[i].pos == 'Josa' || nlp[i].pos == 'Suffix')
                {
                    continue;
                }

                var word = RegExp.escape(nlp[i].text);

                for(var j=0; j<list.length; j++)
                {
                    var match = list[j].input.match(new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i'));
                    if(match && match.length > 0)
                    {
                        if(!checkIntentDupliacte[list[j].intentId._id])
                        {
                            matched.push({ intentId: list[j].intentId._id, intentName: list[j].intentId.name, matchCount: match.length });
                            checkIntentDupliacte[list[j].intentId._id] = true;
                        }
                    }
                }
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
