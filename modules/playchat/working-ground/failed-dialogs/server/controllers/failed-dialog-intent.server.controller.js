var mongoose = require('mongoose');
var UserDialog = mongoose.model('UserDialog');
var IntentContent = mongoose.model('IntentContent');

var path = require('path');
var NLPManager = require(path.resolve('./engine2/input/nlp.js'));

module.exports.analysis = function(req, res)
{
    var query = [
        {$match: { botId: req.params.botId, isFail: true, inOut: true, clear: { $not: /intent/ }, dialog: {$nin: [':reset user', ':build', null]}, dialogId: {$ne: null}, dialogName: {$ne: null} } },
        {$group: { _id: '$dialog', id: {$first: '$_id'}, clear: {$first: '$clear'}, nlpDialog: { $first: '$nlpDialog' }, count: {$sum: 1} } },
        {$sort: { count: -1 }},
        {$limit: 100}
    ];

    UserDialog.aggregate(query).exec(function(err, list)
    {
        if(err)
        {
            console.log(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            IntentContent.find({ botId: req.params.botId }).lean().populate('intentId').exec(function(err, intentContents)
            {
                if(err)
                {
                    console.log(err);
                    return res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    var words = [];
                    for(var i=0; i<intentContents.length; i++)
                    {
                        var ic = intentContents[i].input.split(' ');
                        for(var j=0; j<ic.length; j++)
                        {
                            words.push({ word: ic[j], intent: intentContents[i] });
                        }
                    }

                    var result = [];
                    list = JSON.parse(JSON.stringify(list));
                    for(var i=0; i<list.length; i++)
                    {
                        if(!list[i].nlpDialog)
                            continue;

                        var split = list[i].nlpDialog.split(' ');

                        var regexp = '(';
                        for(var j=0; j<split.length; j++)
                        {
                            if(j > 0)
                                regexp += '|';

                            regexp += '(' + split[j] + ')';
                        }

                        regexp += ')';

                        for(var j=0; j<words.length; j++)
                        {
                            var match = words[j].word.match(new RegExp(regexp, 'gi'));
                            if(match)
                            {
                                if(!list[i].intent)
                                {
                                    list[i].intent = [];
                                    result.push(list[i]);
                                }

                                list[i].intent.push({ intent: words[j].intent, count: match.length });
                            }
                        }
                    }

                    res.jsonp(result);
                }
            });
        }
    });
};

module.exports.saveIntentContents = function(req, res)
{
    var botId = req.params.botId;
    var intentId = req.params.intentId;
    var name = req.body.name;

    console.log(botId, intentId, name);

    var intentContents = new IntentContent();
    intentContents.botId = botId;
    intentContents.intentId = intentId;
    intentContents.user = req.user;
    intentContents.name = name;

    var language = req.body.language || 'ko';
    NLPManager.getNlpedText(language, name, function(err, lastChar, nlpText, nlp)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        intentContents.input = nlpText;

        intentContents.save(function(err)
        {
            if(err)
            {
                return res.status(400).send({ message: err.stack || err });
            }

            res.jsonp(intentContents);
        });
    });
};
