var mongoose = require('mongoose');
var async = require('async');

var EntityContent = mongoose.model('EntityContent');

(function()
{
    var EntityManager = function()
    {

    };

    EntityManager.prototype.analysis = function(bot, nlp, callback)
    {
        var nouns = [];
        var matchedList = [];
        var check = {};
        async.eachSeries(nlp, function(word, next)
        {
            if(word.pos != 'Noun')
            {
                return next();
            }

            nouns.push(word.text);

            var query = { botId: bot.id, name: new RegExp(word.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi') };
            EntityContent.find(query).lean().populate('entityId').populate('entityId').exec(function(err, docs)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i=0; i<docs.length; i++)
                {
                    if(!check[docs[i]._id])
                    {
                        check[docs[i]._id] = true;
                        matchedList.push(docs[i]);
                    }
                }

                next();
            });
        },
        function(err)
        {
            if(err)
            {
                return callback(err);
            }

            var entities = {};
            for(var i=0; i<matchedList.length; i++)
            {
                var count = 0;
                for(var j=0; j<nouns.length; j++)
                {
                    if(matchedList[i].name.indexOf(nouns[j]) != -1)
                    {
                        count++;
                        if(!matchedList[i].matchWord)
                        {
                            matchedList[i].matchWord = [];
                        }

                        matchedList[i].matchWord.push(nouns[j]);
                    }
                }

                if(count / nouns.length >= (bot.entitiesMinMatchRate || 0.5))
                {
                    if(!entities[matchedList[i].entityId.name])
                    {
                        entities[matchedList[i].entityId.name] = [];
                    }

                    entities[matchedList[i].entityId.name].push(matchedList[i]);
                }
            }

            callback(null, entities);
        });
    };

    module.exports = new EntityManager();

})();
