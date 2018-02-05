var mongoose = require('mongoose');
var KnowledgeGraphModel = mongoose.model('KnowledgeGraph');

(function()
{
    var KnowledgeMemoryManager = function()
    {

    };

    KnowledgeMemoryManager.prototype.memory = function(bot, dialog, error, callback)
    {
        if(conversation.nlu.sentenceType == 1 || conversation.nlu.sentenceType != 0)
        {
            callback();
            return;
        }

        var language = bot.language;
        var node1 = '';
        var node2 = '';
        var link = '';

        var nlp = conversation.nlu.nlp;

        if(language == 'en')
        {
            var index = -1;
            var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
            var allPronoun = 0;
            for (var i = 0; i < nlp.length; i++)
            {
                var token = nlp[i];
                if (!isNaN(token.text))
                {
                    continue;
                }

                if (node1 == token.text)
                {
                    continue;
                }

                if (token.text == "the" || token.text == "a" || token.text == "an")
                {
                    continue;
                }

                if (token.pos == "AuxVerb")
                {
                    continue;
                }

                // 초기화
                if (mode == 1)
                {
                    if (token.pos == 'Pronoun' || token.pos == 'Foreign')
                    {
                        mode = 0;
                        node1 = '';
                        node2 = '';
                        link = '';
                        allPronoun = 0;
                    }
                    else if (token.pos == 'Adjective' || token.pos == 'Verb')
                    {
                        link = token.text;
                        mode = 2;
                        index = i;
                    }
                }
                else if(mode == 0)
                {
                    if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign')
                    {
                        node1 = token.text;
                        mode = 1;
                        index = i;
                        if (token.pos == 'Pronoun')
                        {
                            allPronoun = 1;
                        }
                    }
                }
                else if(mode == 2)
                {
                    if (token.pos == 'Noun' || token.pos == 'Foreign' || token.pos == 'Pronoun')
                    {
                        node2 = token.text;
                        if (token.pos == 'Pronoun')
                        {
                            allPronoun = 2;
                        }

                        break;
                    }
                }
            }

            if (allPronoun == 2)
            {
                node1 = '';
                node2 = '';
                link = '';
            }

            console.log("--- factMemory: " + node1 + " / " + node2 + " / " + link + " / " + allPronoun);
        }
        else if (language == "zh")
        {
            var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
            for (var i = 0; i < nlp.length - 1; i++)
            {
                var token = nlp[i];
                if (mode == 0)
                {
                    if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign' || token.pos == 'NR')
                    {
                        node1 = token.text;
                        mode=1;
                    }
                }
                else if (mode == 1)
                {
                    if (token.pos == 'Adjective' || token.pos == 'Verb')
                    {
                        link = token.text;
                        mode=2;
                    }
                }
                else if (mode == 2)
                {
                    if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign')
                    {
                        node2 = token.text;
                        break;
                    }
                }
            }
        }
        else
        {
            for (var i=nlp.length - 1; i >= 0; i--)
            {
                var token = nlp[i];
                if (token.text == '이다' || token.pos == 'Adjective' || token.pos == 'Verb')
                {
                    link = token.text;
                    for (var j = 0; j < i; j++)
                    {
                        var token1 = nlp[j];
                        if (token1.pos == 'Noun')
                        {
                            if (node1 == undefined)
                            {
                                node1 = token1.text;
                                for (var k = j + 1; k < i; k++)
                                {
                                    var token2 = result[k];
                                    if (token2.pos == 'Number' || token2.pos == 'Noun')
                                    {
                                        node2 += token2.text;
                                    }
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }

        if(node1 && node2 && link)
        {
            // var data = new KnowledgeGraphModel();
            var data = {};
            data.userKey = context.user.userKey;
            data.botId = bot.id;
            data.node1 = node1;
            data.node2 = node2;
            data.link = link;

            KnowledgeGraphModel.update({ node1: node1, node2: node2, link: link, botId: bot.id }, data, { upsert: true}).exec(function(err, numAffected)
            {
                if(err)
                {
                    error.delegate(err);
                }
                else
                {
                    callback(numAffected);
                }
            });
        }
        else
        {
            callback();
        }
    };

    module.exports = new KnowledgeMemoryManager();
})();
