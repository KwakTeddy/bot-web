var Globals = require('./globals.js');

(function()
{
    var Quibble = function()
    {

    };

})();

var randomQuibble = function(qs)
{
    return qs[Math.floor(Math.random() * qs.length)];
};

function quibble(nlp, sentenceInfo)
{
    var quibbleSentence = quibbleProcess(globalQuibbles, nlp, sentenceInfo);

    if(quibbleSentence)
    {
        return quibbleSentence;
    }
    else
    {
        return;
    }
}

function quibbleProcess(quibbleScope, nlp, sentenceInfo)
{
    if(nlp == undefined)
    {
        return randomQuibble(Globals.quibbles);
    }

    var text = undefined;
    if(quibbleScope.slangQuibbles)
    {
        for(var j = 0; j < quibbleScope.slangQuibbles.condition.words.length; j++)
        {
            if(text)
            {
                break;
            }

            if(context.dialog.inRaw.indexOf(quibbleScope.slangQuibbles.condition.words[j]) != -1)
            {
                text = randomQuibble(quibbleScope.slangQuibbles.sentences);
                console.log('quibble [욕설]: ' + JSON.stringify(quibbleScope.slangQuibbles));
                break;
            }
        }
    }

    if(text)
    {
        return text;
    }

    if(quibbleScope.nounQuibbles)
    {
        for(var i = 0; i < nlp.length; i++)
        {
            if(text)
            {
                break;
            }

            var token = nlp[i];
            if(token.pos == 'Noun')
            {
                for(var j = 0; j < quibbleScope.nounQuibbles.length; j++)
                {
                    var q = quibbleScope.nounQuibbles[j];
                    if(token.text == q.condition.word)
                    {
                        text = randomQuibble(q.sentences);
                        console.log('quibble [명사]: ' + JSON.stringify(q));
                        break;
                    }
                }
            }
        }
    }

    if(text)
    {
        return text;
    }

    if(quibbleScope.verbQuibbles)
    {
        for(var i = 0; i < nlp.length; i++)
        {
            if(text)
            {
                break;
            }

            var token = nlp[i];
            if(token.pos == 'Verb' || token.pos == 'Adjective')
            {
                for(var j = 0; j < quibbleScope.verbQuibbles.length; j++)
                {
                    var q = quibbleScope.verbQuibbles[j];
                    if(q.condition.word == token.text)
                    {
                        if(q.condition.questionWord && q.condition.questionWord != 'yesno')
                        {
                            for(var k = 0; k < nlp.length; k++)
                            {
                                if(text)
                                {
                                    break;
                                }

                                var token1 = nlp[k];
                                if((q.condition.questionWord == undefined || q.condition.questionWord == token1.text) &&
                                   (q.condition.tenseType  == undefined || sentenceInfo.tenseType == undefined || q.condition.tenseType == sentenceInfo.tenseType) &&
                                   (q.condition.sentenceType  == undefined || sentenceInfo.sentenceType == undefined || q.condition.sentenceType == sentenceInfo.sentenceType)) {
                                    text = randomQuibble(q.sentences);
                                    console.log('quibble [동사]: ' + JSON.stringify(q));
                                    break;
                                }
                            }
                        }
                        else
                        {
                            if((q.condition.tenseType == undefined || sentenceInfo.tenseType == undefined ||  q.condition.tenseType == sentenceInfo.tenseType) &&
                               (q.condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || q.condition.sentenceType == sentenceInfo.sentenceType)) {
                                text = randomQuibble(q.sentences);
                                console.log('quibble [동사]: ' + JSON.stringify(q));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    if(text)
    {
        return text;
    }

    if(quibbleScope.sentenceQuibbles)
    {
        for(var i = 0; i < nlp.length; i++)
        {
            if(text)
            {
                break;
            }

            var token = nlp[i];
            for(var j = 0; j < quibbleScope.sentenceQuibbles.length; j++)
            {
                var q = quibbleScope.sentenceQuibbles[j];
                if((q.condition.questionWord == undefined || q.condition.questionWord == token.text) &&
                   (q.condition.tenseType == undefined || sentenceInfo.tenseType == undefined || q.condition.tenseType == sentenceInfo.tenseType) &&
                   (q.condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || q.condition.sentenceType == sentenceInfo.sentenceType) &&
                   (q.condition.nlpLength == undefined ||  q.condition.nlpLength < nlp.length)) {
                    text = randomQuibble(q.sentences);
                    console.log('quibble [문장]: ' + JSON.stringify(q));
                    break;
                }
            }
        }
    }

    if(text)
    {
        return text;
    }

    console.log('quibble [최종]: ' + JSON.stringify(quibbleScope.quibbles, null, 2));

    if(quibbleScope.quibbles)
    {
        return randomQuibble(quibbleScope.quibbles);
    }
    else
    {
        return;
    }
}

exports.quibble = quibble;
