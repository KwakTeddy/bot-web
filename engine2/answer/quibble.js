var randomQuibble = function(qs)
{
    return qs ? qs[Math.floor(Math.random() * qs.length)] : undefined;
};

(function()
{
    var QuibbleManager = function()
    {

    };

    QuibbleManager.prototype.getSlangQuibble = function(quibbles, inputRaw)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<quibbles[i].condition.words.length; j++)
            {
                if(inputRaw.indexOf(quibbles[i].condition.words[j]) != -1 && quibbles[i].condition.words[j].length / inputRaw.length >= 0.7)
                {
                    return randomQuibble(quibbles[i].sentences);
                }
            }
        }
    };

    QuibbleManager.prototype.getNounQuibble = function(quibbles, nlp)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<nlp.length; j++)
            {
                if(nlp[j].pos == 'Noun' && quibbles[i].condition.words.indexOf(nlp[j].text) != -1)
                {
                    return randomQuibble(quibbles[i].sentences);
                }
            }
        }
    };

    QuibbleManager.prototype.getVerbQuibble = function(quibbles, nlp, sentenceInfo)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<nlp.length; j++)
            {
                if((nlp[j].pos == 'Verb' || nlp[j].post == 'Adjective') && quibbles[i].condition.words.indexOf(nlp[j].text) != -1)
                {
                    return randomQuibble(quibbles[i].sentences);
                    // if(quibbles[i].condition.questionWord && quibbles[i].condition.questionWord != 'yesno')
                    // {
                    //     var token1 = nlp[j];
                    //     if((quibbles[i].condition.questionWord == undefined || quibbles[i].condition.questionWord == token1.text) &&
                    //        (quibbles[i].condition.tenseType  == undefined || sentenceInfo.tenseType == undefined || quibbles[i].condition.tenseType == sentenceInfo.tenseType) &&
                    //        (quibbles[i].condition.sentenceType  == undefined || sentenceInfo.sentenceType == undefined || quibbles[i].condition.sentenceType == sentenceInfo.sentenceType)) {
                    //         return randomQuibble(quibbles[i].sentences);
                    //     }
                    // }
                    // else
                    // {
                    //     if((quibbles[i].condition.tenseType == undefined || sentenceInfo.tenseType == undefined ||  quibbles[i].condition.tenseType == sentenceInfo.tenseType) &&
                    //        (quibbles[i].condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || quibbles[i].condition.sentenceType == sentenceInfo.sentenceType)) {
                    //         return randomQuibble(quibbles[i].sentences);
                    //     }
                    // }
                }
            }
        }
    };

    QuibbleManager.prototype.getSentenceQuibble = function(quibbles, nlp, sentenceInfo)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            var q = quibbles[i];

            for(var j=0; j<nlp.length; j++)
            {
                if(q.condition.words.indexOf(nlp[j].text) != -1)
                {
                    return randomQuibble(q.sentences);
                }
                //
                // var token = nlp[j];
                // if((q.condition.questionWord == undefined || q.condition.words.indexOf(token.text) != -1) &&
                //    (q.condition.tenseType == undefined || sentenceInfo.tenseType == undefined || q.condition.tenseType == sentenceInfo.tenseType) &&
                //    (q.condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || q.condition.sentenceType == sentenceInfo.sentenceType) &&
                //    (q.condition.nlpLength == undefined || q.condition.nlpLength < nlp.length)) {
                //     return randomQuibble(q.sentences);
                // }
            }
        }
    };

    QuibbleManager.prototype.process = function(quibbles, userInput)
    {
        var nlp = userInput.nlp;
        var nlpText = userInput.nlpText;
        var inputRaw = userInput.text;
        var sentenceInfo = userInput.sentence;

        var nlpCount = 0;
        for(var i=0; i<nlp.length; i++)
        {
            if(nlp[i].pos == 'Noun')
            {
                nlpCount += 3;
            }
            else if(nlp[i].pos == 'Verb')
            {
                nlpCount += 2;
            }
            else
            {
                nlpCount += 1;
            }
        }

        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<quibbles[i].words.length; j++)
            {
                if(typeof quibbles[i].words[j] == 'string')
                {
                    if(inputRaw.indexOf(quibbles[i].words[j]) != -1)
                    {
                        return randomQuibble(quibbles[i].sentences);
                    }
                }
                else
                {
                    var word = quibbles[i].words[j].word;
                    if(typeof word == 'string' && nlpText.indexOf(word) != -1)
                    {
                        if(quibbles[i].words[j].questionWord && (quibbles[i].words[j].questionWord == 'yesno' || nlpText.indexOf(quibbles[i].words[j].questionWord) != -1))
                        {
                            return randomQuibble(quibbles[i].sentences);
                        }
                        else if(quibbles[i].words[j].sentenceType && quibbles[i].words[j].sentenceType == userInput.sentenceInfo)
                        {
                            return randomQuibble(quibbles[i].sentences);
                        }
                    }
                    else if(!word && quibbles[i].words[j].sentenceType && quibbles[i].words[j].sentenceType == userInput.sentenceInfo)
                    {
                        return randomQuibble(quibbles[i].sentences);
                    }
                    else if(inputRaw.indexOf(quibbles[i].words[j].word) != -1 && quibbles[i].words[j].word.length / inputRaw.length >= 0.5)
                    {
                        return randomQuibble(quibbles[i].sentences);
                    }
                }
            }
        }
    };

    module.exports = new QuibbleManager();
})();
