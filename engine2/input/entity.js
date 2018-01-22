var mongoose = require('mongoose');
var async = require('async');

var EntityContentSynonym = mongoose.model('EntityContentSynonym');

(function()
{
    var EntityManager = function()
    {

    };

    EntityManager.prototype.getNouns = function(nlp)
    {
        var phrase = '';
        var phraseCount = 0;
        var nouns = [];
        for(var i in nlp)
        {
            if(!(nlp[i].pos == 'Josa' || nlp[i].pos == 'Suffix' || nlp[i].pos == 'Verb' || nlp[i].pos == 'Adjective'))
            {
                if(nlp[i].pos == 'Noun')
                {
                    nouns.push(nlp[i].text);
                }

                if(phraseCount > 0 && nlp[i].offset > nlp[i-1].offset + nlp[i-1].length)
                {
                    phrase += ' ';
                }

                phrase += nlp[i].text;
                phraseCount ++;

                if(phraseCount > 1)
                {
                    nouns.push(phrase);
                }
            }
            else
            {
                phrase = '';
                phraseCount = 0;
            }
        }

        nouns.sort(function (a, b)
        {
            return b.length - a.length;
        });

        return nouns;
    };

    EntityManager.prototype.getEntities = function(check, query, nouns, callback)
    {
        var entities = {};
        async.eachSeries(nouns, function(word, next)
        {
            var query = { name: word };
            if(check)
            {
                if(bot.templateId)
                {
                    query.templateId = bot.templateId;
                }
                else
                {
                    query.botId = bot.id;
                }
            }
            else
            {
                query.botId = undefined;
            }

            EntityContentSynonym.find(query).lean().populate('entityId').populate('contentId').exec(function(err, docs)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i in docs)
                {
                    if(docs[i].entityId)
                    {
                        if(entities[docs[i].entityId.name] == undefined)
                        {
                            entities[docs[i].entityId.name] = [];
                        }

                        entities[docs[i].entityId.name].push({ word: word, synonym: docs[i].contentId.name });
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

            callback(null, entities);
        });
    };

    EntityManager.prototype.analysis = function(bot, nlp, callback)
    {
        var entities = {};
        var nouns = this.getNouns(nlp);

        var that = this;
        this.getEntities(true, nouns, entities, function(err)
        {
            if (err)
            {
                return callback(err);
            }

            that.getEntities(false, nouns, entities, function(err)
            {
                if (err)
                {
                    return callback(err);
                }

                callback(null, entities);
            });
        });
    };

    module.exports = new EntityManager();

})();
