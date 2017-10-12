var async = require('async');

var mongoose = require(_botEngineModules.mongoose);
var EntityContentSynonym = mongoose.model('EntityContentSynonym');

var getNouns = function(nlp)
{
    var nouns = [];
    var phrase = '';
    var phraseCount = 0;
    for(var i in nlp)
    {
        if(!(nlp[i].pos == 'Josa' || nlp[i].pos == 'Verb' || nlp[i].pos == 'Adjective'))
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
            nouns.push(phrase);
        }
        else
        {
            phrase = '';
            phraseCount = 0;
        }
    }

    nouns = nouns.sort(function (a, b)
    {
        return b.length - a.length;
    });

    return nouns;
};

var getEntities = function(botId, nouns, callback)
{
    var entities = {};
    async.eachSeries(nouns, function(word, done)
    {
        EntityContentSynonym.find({ botId: botId, name: word }).lean().populate('entityId').populate('contentId').exec(function(err, docs)
        {
            if(!err)
            {
                for(var i in docs)
                {
                    if(docs[i].entityId && entities[docs[i].entityId.name] == undefined)
                    {
                        entities[docs[i].entityId.name] = docs[i].contentId.name;
                    }
                }
            }

            done();
        });
    },
    function(err)
    {
        callback(entities);
    });
};

module.exports.matchDictionaryEntities = function(botId, nlp, done)
{
    var entities = {};
    var nouns = getNouns(nlp);
    getEntities(botId, nouns, function(result)
    {
        for(var key in result)
        {
            entities[key] = result[key];
        }

        getEntities(null, nouns, function(result)
        {
            for(var key in result)
            {
                entities[key] = result[key];
            }

            done(entities);
        });
    });
};
