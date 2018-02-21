var randomQuibble = function(qs)
{
    return qs[Math.floor(Math.random() * qs.length)];
};

function quibbleProcess(quibbles, userInput)
{
    var nlp = userInput.nlp;
    var inputRaw = userInput.text;
    
    if(nlp == undefined)
    {
        return randomQuibble(quibbles.quibbles);
    }

    var text = undefined;
    if(quibbles.slangQuibbles)
    {
        for(var j = 0; j < quibbles.slangQuibbles.condition.words.length; j++)
        {
            if(text)
            {
                break;
            }

            if(inputRaw.indexOf(quibbles.slangQuibbles.condition.words[j]) != -1)
            {
                text = randomQuibble(quibbles.slangQuibbles.sentences);
                console.log('quibble [욕설]: ' + JSON.stringify(quibbles.slangQuibbles));
                break;
            }
        }
    }

    if(text)
    {
        return text;
    }

    if(quibbles.nounQuibbles)
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
                for(var j = 0; j < quibbles.nounQuibbles.length; j++)
                {
                    var q = quibbles.nounQuibbles[j];
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

    if(quibbles.verbQuibbles)
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
                for(var j = 0; j < quibbles.verbQuibbles.length; j++)
                {
                    var q = quibbles.verbQuibbles[j];
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

    if(quibbles.sentenceQuibbles)
    {
        for(var i = 0; i < nlp.length; i++)
        {
            if(text)
            {
                break;
            }

            var token = nlp[i];
            for(var j = 0; j < quibbles.sentenceQuibbles.length; j++)
            {
                var q = quibbles.sentenceQuibbles[j];
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

    console.log('quibble [최종]: ' + JSON.stringify(quibbles.quibbles, null, 2));

    if(quibbles.quibbles)
    {
        return randomQuibble(quibbles.quibbles);
    }
    else
    {
        return;
    }
}

exports.quibble = quibbleProcess;
